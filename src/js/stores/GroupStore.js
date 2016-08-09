import React from 'react';
import Store from '../common/Store';
import GroupService from '../services/GroupService';
import dispatcher from '../dispatcher/AppDispatcher';
import {
  GROUP_LIST,
  GROUP_CREATE,
  GROUP_DELETE,
  GROUP_UPDATE,
  LOAD_USER_GROUP,
  SUBSCRIBE_TO_GROUP,
} from '../constants/GroupConstants';
import _ from 'lodash';

const data = {
  groups: null,
  totalGroups: null,
  startPage: null,
};

class GroupStore extends Store {
  get groups() {
    return data.groups;
  }
  get totalGroups() {
    return data.totalGroups;
  }
  get startPage() {
    return data.startPage;
  }

  findById(id) {
    return data.groups.filter((el) => {
      return String(el._id) === String(id);
    });
  }
}

export const groupStore = new GroupStore();

groupStore.dispatcherToken = dispatcher.register(function (action) {
  switch (action.type) {
    case GROUP_LIST:
      if (!action.groups) {
        return;
      }
      data.groups = action.groups;
      data.totalGroups = action.count;
      data.startPage = action.startPage;
      groupStore.emitChange();
      break;
    case LOAD_USER_GROUP:
      if (!action.groups) {
        return;
      }
      data.groups = action.groups;
      groupStore.emitChange();
      break;
    case SUBSCRIBE_TO_GROUP:
      delete data.groups[action.index];
      groupStore.emitChange();
      break;
    case GROUP_CREATE:
      if (!action.group) {
        return;
      }
      data.groups.push(action.group);
      groupStore.emitChange();
      break;
    case GROUP_UPDATE:
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
      groupStore.emitChange();
      break;
    case GROUP_DELETE:
      delete data.groups[action.index];
      groupStore.emitChange();
      break;
  }
});

export default GroupStore;
