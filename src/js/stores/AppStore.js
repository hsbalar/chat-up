import dispatcher from '../dispatcher/AppDispatcher';
import Store from '../common/Store';
import io from 'socket.io-client';

const socket = io.connect();

import { AUTH_INIT, AUTH_LOGIN, AUTH_LOGOUT } from '../constants/AppConstants';

const data = {
  user: null,
  loaded: false,
};

class AppStore extends Store {
  get user() {
    return data.user;
  }

  isLoaded() {
    return !!data.loaded;
  }

  isLoggedIn() {
    return !!data.user;
  }
}

const store = new AppStore();

store.dispatcherToken = dispatcher.register(function (action) {
  switch (action.type) {
    case AUTH_INIT:
      data.loaded = true;
    case AUTH_LOGIN:
      data.user = action.user;
      if (data.user) {
        socket.emit('on:login', data.user.id);
      }
      store.emitChange();
      break;
    case AUTH_LOGOUT:
      if (data.user) {
        socket.emit('on:disconnect-room', data.user.id);
      }
      data.user = null;
      store.emitChange();
      break;
    default:
      break;
  }
});

export default store;
