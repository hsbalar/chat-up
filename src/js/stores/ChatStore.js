import _ from 'lodash';
import io from 'socket.io-client';
import Store from '../common/Store';
import dispatcher from '../dispatcher/AppDispatcher';
import {
  CHAT_ROOM,
  NEW_ROOM,
  NEW_GROUP_ROOM,
  CHAT_USER_LIST,
  CHAT_GROUP_LIST,
  CHAT_LOAD_MESSAGES,
  CHAT_ROOM_DISMISS,
  CUSTOM_ROOM,
} from '../constants/ChatConstants';
import AppStore from './AppStore';

const socket = io.connect();
const ROOMS = {};

const data = {
  users: null,
  groups: null,
  onlineUsers: null,
};

class ChatStore extends Store {
  get chatusers() {
    return data.users;
  }
  getOnlineUsers() {
    return data.onlineUsers;
  }
  get chatgroups() {
    return data.groups;
  }

  getRoom(roomId) {
    return ROOMS[roomId];
  }

  getRooms() {
    return _.keys(ROOMS);
  }

  getDisplayName(roomId) {
    if (!ROOMS[roomId]) {
      return [];
    }
    return ROOMS[roomId].receiverName;
  }

  getReceiverID(roomId) {
    if (!ROOMS[roomId]) {
      return [];
    }
    return ROOMS[roomId].rid;
  }

  getRecType(roomId) {
    if (!ROOMS[roomId]) {
      return [];
    }
    return ROOMS[roomId].recType;
  }

  getMessages(roomId) {
    if (!ROOMS[roomId]) {
      return [];
    }
    return ROOMS[roomId].messages;
  }

  findUsernameByID(id) {
    let user = data.users.filter((el) => {
      return String(el._id) === String(id);
    });
    return user[0].firstName + ' ' + user[0].lastName;
  }
}

const chatStore = new ChatStore();

socket.on('init', (data) => {
  console.log('Init' + data.message);
});

socket.on('on:loginconnect', (users) => {
  data.onlineUsers = users.onlineusers;
  chatStore.emitChange();
});

socket.on('on:room-connect', (data) => {
  let roomId = data.roomId;
  let receiverName = data.receiverName;
  let recType = data.recType;

  let room = ROOMS[roomId];
  room = ROOMS[roomId] = {
    messages: [],
    receiverName: receiverName,
    recType: recType,
  };
  room.messages = data.messages;
  chatStore.emitChange();
});

socket.on('on:room-custom-group-connect', (data) => {
  let roomId = data.roomId;
  let receiverName = data.receiverName;
  let recType = data.recType;

  let room = ROOMS[roomId];
  room = ROOMS[roomId] = {
    messages: [],
    receiverName: receiverName,
    recType: recType,
  };
  room.messages = data.messages;
  console.log(ROOMS[roomId].receiverName);
  chatStore.emitChange();
});

socket.on('on:join', (data) => {
  let roomId = data.roomId;
  let receiverName = data.receiverName;
  let recType = data.recType;

  let room = ROOMS[roomId];
  room = ROOMS[roomId] = {
    messages: [],
    receiverName: receiverName,
    recType: recType,
  };
  room.messages = data.messages;
  chatStore.emitChange();
});

socket.on('on:chat', (data) => {
  let roomId = data.roomId;
  let recType = data.recType;
  let receiverName = data.receiverName;
  let rid = data.rid;
  let room = ROOMS[roomId];
  if (!room) {
    room = ROOMS[roomId] = {
      messages: [],
      receiverName: receiverName,
      recType: recType,
      rid: rid,
    };
  }
  if (ROOMS[roomId]) {
    ROOMS[roomId].messages.push(data.message);
  }
  chatStore.emitChange();
});

socket.on('on:disconnect', (users) => {
  data.onlineUsers = users.onlineusers;
  chatStore.emitChange();
});

chatStore.dispatcherToken = dispatcher.register(function (action) {
  switch (action.type) {
    case CHAT_LOAD_MESSAGES:
      let roomId = action.room;
      let room = ROOMS[roomId];
      if (action.messages) {
        room.messages = action.messages;
      }
      chatStore.emitChange();

      break;

    case CHAT_USER_LIST:
      data.users = action.users;
      socket.emit('on:login', AppStore.user.id);
      chatStore.emitChange();
      break;

    case CHAT_GROUP_LIST:
      data.groups = action.groups;
      chatStore.emitChange();
      break;

    case NEW_ROOM:
      let users = {
        sender: AppStore.user.id,
        receiver: action.rid,
        receiverName: action.receiverName,
      };
      socket.emit('on:create-room', users, action.rec);
      break;

    case NEW_GROUP_ROOM:
      socket.emit(
        'on:create-group-room',
        action.roomId,
        action.receiverName,
        action.rec
      );
      break;
    case CUSTOM_ROOM:
      socket.emit(
        'on:create-custom-group-room',
        AppStore.user.id,
        action.roomId,
        action.users
      );
      break;
    case CHAT_ROOM:
      if (ROOMS[action.roomId].recType === 'custom') {
        socket.emit(
          'on:custom-chat',
          action.roomId,
          action.msg,
          AppStore.user.id,
          action.rid,
          ROOMS[action.roomId].receiverName
        );
      } else {
        if (action.recType === 'group') {
          socket.emit(
            'on:chat-room',
            action.roomId,
            action.msg,
            AppStore.user.id,
            action.rid,
            ROOMS[action.roomId].receiverName
          );
        } else {
          socket.emit(
            'on:private-chat',
            action.roomId,
            action.msg,
            AppStore.user.id,
            action.rid,
            AppStore.user.fullName
          );
        }
      }

      break;

    case CHAT_ROOM_DISMISS:
      if (ROOMS[action.room]) {
        delete ROOMS[action.room];
        chatStore.emitChange();
      }
      break;
  }
});

export default chatStore;
