import dispatcher from '../dispatcher/AppDispatcher';
import ChatConstants from '../constants/ChatConstants';

export default {
  loadMessages(messages, rid, room) {
    dispatcher.dispatch({
      type: ChatConstants.CHAT_LOAD_MESSAGES,
      messages: messages,
      rid: rid,
      room: room,
    });
  },

  chatUserList(users) {
    dispatcher.dispatch({
      type: ChatConstants.CHAT_USER_LIST,
      users: users,
    });
  },

  chatGroupList(groups) {
    dispatcher.dispatch({
      type: ChatConstants.CHAT_GROUP_LIST,
      groups: groups,
    });
  },

  createRoom(rid, receiverName, rec) {
    dispatcher.dispatch({
      type: ChatConstants.NEW_ROOM,
      rid: rid,
      receiverName: receiverName,
      rec: rec,
    });
  },

  createCustomRoom(roomId, users) {
    dispatcher.dispatch({
      type: ChatConstants.CUSTOM_ROOM,
      roomId: roomId,
      users: users,
    });
  },

  createGroupRoom(roomId, receiverName, rec) {
    console.log('Create group Room action');

    dispatcher.dispatch({
      type: ChatConstants.NEW_GROUP_ROOM,
      roomId: roomId,
      receiverName: receiverName,
      rec: rec,
    });
  },

  newMessage(msg, roomId, rid, recType) {
    dispatcher.dispatch({
      type: ChatConstants.CHAT_ROOM,
      msg: msg,
      roomId: roomId,
      rid: rid,
      recType: recType,
    });
  },

  disconnectRoom(room) {
    dispatcher.dispatch({
      type: ChatConstants.CHAT_ROOM_DISMISS,
      room: room,
    });
  },
};
