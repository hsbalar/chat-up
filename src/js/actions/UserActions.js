import router from '../services/RouterService';
import dispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';

export default {
  list(users, query, count, startPage) {
    dispatcher.dispatch({
      type: UserConstants.USER_LIST,
      users: users,
      count: count,
      startPage: startPage,
    });
  },

  create(user, query) {
    dispatcher.dispatch({
      type: UserConstants.USER_CREATE,
      user: user,
    });
    router.get().transitionTo('/');
  },

  updateAvatar(filename) {
    dispatcher.dispatch({
      type: UserConstants.UPDATE_AVATAR,
      filename: filename,
    });
  },

  update(user, query) {
    dispatcher.dispatch({
      type: UserConstants.USER_UPDATE,
      user: user,
    });
    router
      .get()
      .transitionTo('list_user', {}, query && query.page ? query : { page: 1 });
  },

  delete(index) {
    dispatcher.dispatch({
      type: UserConstants.USER_DELETE,
      index: index,
    });
  },
};
