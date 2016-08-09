import router from '../services/RouterService';
import dispatcher from '../dispatcher/AppDispatcher';

import AppConstants from '../constants/AppConstants';

export default {
  init(user) {
    dispatcher.dispatch({
      type: AppConstants.AUTH_INIT,
      user: user,
    });
  },

  login(user) {
    dispatcher.dispatch({
      type: AppConstants.AUTH_LOGIN,
      user: user,
    });
  },

  logout() {
    dispatcher.dispatch({
      type: AppConstants.AUTH_LOGOUT,
    });
  },
};
