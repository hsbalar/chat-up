import _ from 'lodash';

const rooms = {};
const usersRooms = {};
const people = {};
const onlineusers = [];
export default function (app, socket) {
  if (!socket) {
    return;
  }

  socket.emit('init', {
    message: 'Welcome!!!',
  });

  socket.on('on:login', (userID) => {
    if (onlineusers.indexOf(userID) < 0) {
      onlineusers.push(userID);
    }
    people[userID] = { socketID: socket.id };
    socket.emit('on:loginconnect', { onlineusers: onlineusers });
    socket.broadcast.emit('on:loginconnect', { onlineusers: onlineusers });
  });

  socket.on('on:create-room', (users, recType) => {
    let rid = users.receiver;
    let uid = users.sender;
    let receiverName = users.receiverName;

    if (rooms[rid + uid]) {
      socket.join(rid + uid);
      rooms[rid + uid].users.push(uid);
      let room = rooms[rid + uid];
      socket.emit('on:join', {
        receiverName: receiverName,
        roomId: rid + uid,
        messages: _.takeRight(room.messages, 4),
        recType: recType,
      });
    } else {
      //Storing userid refer to it's room id
      let user = usersRooms[uid];
      user = usersRooms[uid] = {
        roomId: [],
      };
      user.roomId.push(uid);
      user = usersRooms[rid] = {
        roomId: [],
      };
      user.roomId.push(rid);

      let roomId = uid + rid;
      let room = rooms[roomId];
      if (!room) {
        room = rooms[roomId] = {
          users: [],
          messages: [],
        };
      }
      rooms[roomId].users.push(uid);
      socket.join(roomId);
      socket.emit('on:room-connect', {
        receiverName: receiverName,
        roomId: roomId,
        messages: _.takeRight(room.messages, 4),
        recType: recType,
      });
    }
  });

  socket.on('on:create-group-room', (roomId, receiverName, recType) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      let room = rooms[roomId];
      socket.emit('on:join', {
        receiverName: receiverName,
        roomId: roomId,
        messages: _.takeRight(room.messages, 4),
        recType: recType,
      });
    } else {
      let room = rooms[roomId];
      if (!room) {
        room = rooms[roomId] = {
          users: [],
          messages: [],
        };
      }
      socket.join(roomId);
      socket.emit('on:room-connect', {
        receiverName: receiverName,
        roomId: roomId,
        messages: _.takeRight(room.messages, 4),
        recType: recType,
      });
    }
  });

  socket.on('on:create-custom-group-room', (userId, roomId, users) => {
    let room = rooms[roomId];
    if (!room) {
      room = rooms[roomId] = {
        users: [],
        messages: [],
        recType: 'custom',
      };
    }
    rooms[roomId].users.push(userId);
    let receiverName = '';
    let memCount = 0;
    for (let i = 0; i < users.length; i++) {
      let user = users[i].split(',');
      let name = user[1].split(' ');
      rooms[roomId].users.push(user[0]);
      if (i < 2) {
        receiverName += name[0] + ', ';
      } else {
        memCount += 1;
      }
    }
    if (memCount > 0) {
      receiverName = receiverName + '+' + memCount;
    } else {
      let onlyname = receiverName.split(',');
      receiverName = onlyname[0] + ', ' + onlyname[1];
    }

    socket.join(roomId);
    socket.emit('on:room-custom-group-connect', {
      receiverName: receiverName,
      roomId: roomId,
      messages: _.takeRight(room.messages, 4),
      recType: 'custom',
    });
  });
  socket.on('on:typingmessage', (typing, roomID, rid) => {
    if (people[rid]) {
      let receiverSocketId = people[rid].socketID;
      socket
        .in(receiverSocketId)
        .emit('on:typing', { typing: typing, roomID: roomID });
    }
  });
  socket.on('on:chat-room', (roomId, message, uid, rid, receiverName) => {
    let room = rooms[roomId];
    if (room) {
      room.messages.push(message);
    }
    socket.broadcast.emit('on:chat', {
      message: message,
      roomId: roomId,
      receiverName: receiverName,
    });
  });

  socket.on('on:private-chat', (roomId, message, uid, rid, receiverName) => {
    if (people[rid]) {
      let receiverSocketId = people[rid].socketID;
      let room1 = usersRooms[rid].roomId;
      let room = rooms[room1];
      if (room) {
        room.messages.push(message);
      }
      socket.in(receiverSocketId).emit('on:chat', {
        message: message,
        roomId: roomId,
        recType: 'user',
        rid: uid,
        receiverName: receiverName,
      });
    }
  });

  socket.on('on:custom-chat', (roomId, message, uid, rid, receiverName) => {
    let users = rooms[roomId].users;
    for (let i = 0; i < users.length; i++) {
      let receid = users[i];
      if (people[receid]) {
        let receiverSocketId = people[receid].socketID;
        socket.in(receiverSocketId).emit('on:chat', {
          message: message,
          roomId: roomId,
          recType: 'custom',
          rid: uid,
          receiverName: receiverName,
        });
      }
    }
  });

  socket.on('on:disconnect-room', (userId) => {
    let index = onlineusers.indexOf(
      onlineusers.filter((el) => {
        return String(el) === String(userId);
      })[0]
    );
    if (index !== -1) {
      onlineusers.splice(index, 1);
    }
    socket.leave(userId);
    socket.broadcast.emit('on:disconnect', { onlineusers: onlineusers });
  });
}
