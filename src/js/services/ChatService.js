import ChatActions from '../actions/ChatActions';
import AppStore from '../stores/AppStore';
import request from '../common/request';

class ChatService {
  loadUser() {
    return request
      .get('/chatUserList')
      .promise()
      .then((res) => {
        let users = res.body.users;
        ChatActions.chatUserList(users);
      })
      .catch((err) => {});
  }

  searchUser(search) {
    return request
      .get('/searchChatUserList')
      .query({ search: search })
      .promise()
      .then((res) => {
        let users = res.body.users;
        ChatActions.chatUserList(users);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }

  searchGroup(search) {
    return request
      .get('/searchChatGroupList')
      .query({ search: search })
      .promise()
      .then((res) => {
        let groups = res.body.groups;
        ChatActions.chatGroupList(groups);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }

  loadGroup() {
    return request
      .get('/chatGroupList')
      .promise()
      .then((res) => {
        let groups = res.body.groups;
        ChatActions.chatGroupList(groups);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createRoom(rid, rec, receiverName) {
    if (rec === 'group') {
      let roomId = rid;
      ChatActions.createGroupRoom(roomId, receiverName, rec);
    } else {
      ChatActions.createRoom(rid, receiverName, rec);
    }
  }

  createCustomRoom(users) {
    return request
      .get('/createCustomRoom')
      .promise()
      .then((res) => {
        let roomId = res.body.roomId;
        ChatActions.createCustomRoom(roomId, users);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  post(msg, roomId, rid, recType) {
    let date = new Date().toString();
    ChatActions.newMessage(
      msg + ',' + date + ',' + AppStore.user.avatar,
      roomId,
      rid,
      recType
    );
  }

  loadPrevMessages(rid, room) {
    let query = {
      sid: AppStore.user.id,
      rid: rid,
    };

    return request
      .get('/loadPrevMessages')
      .query(query)
      .promise()
      .then((res) => {
        let messages = res.body.messages;
        if (messages) {
          ChatActions.loadMessages(messages, rid, room);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  disconnectRoom(room) {
    ChatActions.disconnectRoom(room);
  }
}
export default new ChatService();
