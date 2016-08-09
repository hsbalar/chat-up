import router from '../services/RouterService';
import dispatcher from '../dispatcher/AppDispatcher';
import GroupConstants from '../constants/GroupConstants';

export default {
  list(groups, query, count, startPage) {
    dispatcher.dispatch({
      type: GroupConstants.GROUP_LIST,
      groups: groups,
      count: count,
      startPage: startPage,
    });
    router
      .get()
      .transitionTo(
        'list_group',
        {},
        query && query.page ? query : { page: 1 }
      );
  },
  loadUserGroup(groups) {
    dispatcher.dispatch({
      type: GroupConstants.LOAD_USER_GROUP,
      groups: groups,
    });
  },
  subscribeToGroup(index) {
    dispatcher.dispatch({
      type: GroupConstants.SUBSCRIBE_TO_GROUP,
      index: index,
    });
  },
  create(group, query) {
    dispatcher.dispatch({
      type: GroupConstants.GROUP_CREATE,
      group: group,
    });
    router
      .get()
      .transitionTo(
        'list_group',
        {},
        query && query.page ? query : { page: 1 }
      );
  },

  update(group, query) {
    dispatcher.dispatch({
      type: GroupConstants.GROUP_UPDATE,
      group: group,
    });
  },

  delete(index) {
    dispatcher.dispatch({
      type: GroupConstants.GROUP_DELETE,
      index: index,
    });
  },
};
