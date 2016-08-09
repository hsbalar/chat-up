import React from 'react';
import Store from '../common/Store';
import UserService from '../services/UserService';
import dispatcher from '../dispatcher/AppDispatcher';
import {
  USER_LIST,
  USER_CREATE,
  USER_DELETE,
  USER_UPDATE,
  UPDATE_AVATAR,
} from '../constants/UserConstants';
import _ from 'lodash';

const data = {
  users: null,
  totalUsers: null,
  startPage: null,
  savedAvatar: null,
};

class UserStore extends Store {
  get users() {
    return data.users;
  }
  get totalUsers() {
    return data.totalUsers;
  }
  get startPage() {
    return data.startPage;
  }

  get savedAvatar() {
    return data.savedAvatar;
  }

  findById(id) {
    return data.users.filter((el) => {
      return String(el._id) === String(id);
    });
  }
}

export const userStore = new UserStore();

userStore.dispatcherToken = dispatcher.register(function (action) {
  switch (action.type) {
    case USER_LIST:
      if (!action.users) {
        return;
      }
      data.users = action.users;
      data.totalUsers = action.count;
      data.startPage = action.startPage;
      userStore.emitChange();
      break;
    case USER_CREATE:
      break;
    case UPDATE_AVATAR:
      data.savedAvatar = action.filename;
      userStore.emitChange();
      break;
    case USER_UPDATE:
      // let item = action.user;
      // if (!item) {
      //    return;
      //  }
      //  let index = 0;
      //  for(let i=0;i<data.users.length;i++){
      //    if(String(item._id)==String(data.users[i]._id)){
      //       index = i;
      //       break;
      //    }
      //  }
      //  data.users.splice(index,1,item);
      //  console.log(data.users);
      userStore.emitChange();
      break;
    case USER_DELETE:
      delete data.users[action.index];
      userStore.emitChange();
      break;
    // case USER_LOADGROUP:
    //   if (!action.groups) {
    //     return;
    //   }
    //   data.groups = action.groups;
    //   userStore.emitChange();
    //   break;
  }
});

export default UserStore;
