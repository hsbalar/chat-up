import request from '../common/request';
import GroupActions from '../actions/GroupActions';

class GroupService {
  load(query) {
    return request
      .get('/listGroup')
      .query(query)
      .promise()
      .then((res) => {
        let groups = res.body.groups;
        let count = res.body.count;
        let startPage = res.body.startPage;
        GroupActions.list(groups, query, count, startPage);
      })
      .catch((err) => {
        if (err) {
          GroupActions.list(null, null);
        }
      });
  }

  loadUserGroup(query) {
    return request
      .post('/loadUserGroup')
      .query(query)
      .promise()
      .then((res) => {
        let groups = res.body.groups;
        console.log(groups);
        GroupActions.loadUserGroup(groups);
      })
      .catch((err) => {
        if (err) {
          GroupActions.loadUserGroup(null);
        }
      });
  }

  search(search) {
    return request
      .get('/groupSearch')
      .query({ search: search })
      .promise()
      .then((res) => {
        let groups = res.body.groups;
        let count = groups.length;
        let startPage = 1;
        GroupActions.list(groups, count, startPage);
      })
      .catch((err) => {
        if (err) {
          GroupActions.list(null, null);
        }
      });
  }

  postComment(groupId, content) {
    return request
      .post('/postComment/' + groupId)
      .send({ content: content })
      .promise()
      .then((res) => {})
      .catch((err) => {
        if (err) {
          console.log('Error :', err);
        }
      });
  }
  subscribeToGroup(query, index) {
    return request
      .post('/subscribeToGroup/' + query.userId)
      .query(query)
      .promise()
      .then((res) => {
        GroupActions.delete(index);
      })
      .catch((err) => {
        if (err) {
          GroupActions.delete(null);
        }
      });
  }

  unsubscribeFromGroup(query) {
    return request
      .post('/unsubscribeFromGroup/' + query.userId)
      .query(query.groupId)
      .promise()
      .then((res) => {})
      .catch((err) => {
        if (err) {
          console.log('Error :', err);
        }
      });
  }
  create(item) {
    if (item.avatar) {
      let avatar = item.avatar;
      delete item.avatar;
      request
        .post('/saveGroup')
        .attach('avatar', avatar, avatar.name)
        .field('name', item.name)
        .field('description', item.description)
        .then((res) => {
          let newGroup = res.body;
          GroupActions.create(newGroup);
        })
        .catch((err) => {
          if (err) {
            GroupActions.create(null);
          }
        });
    } else {
      request
        .post('/saveGroup')
        .send(item)
        .promise()
        .then((res) => {
          let newGroup = res.body;
          GroupActions.create(newGroup);
        })
        .catch((err) => {
          if (err) {
            GroupActions.create(null);
          }
        });
    }
  }
  update(item) {
    if (item.avatar) {
      let avatar = item.avatar;
      delete item.avatar;
      request
        .post('/updateGroup/' + item._id)
        .attach('avatar', avatar, avatar.name)
        .field('name', item.name)
        .field('description', item.description)
        .then((res) => {
          let group = res.body;
          GroupActions.update(group);
        })
        .catch((err) => {
          if (err) {
            GroupActions.update(null);
          }
        });
    } else {
      request
        .post('/updateGroup/' + item._id)
        .send(item)
        .promise()
        .then((res) => {
          let group = res.body;
          GroupActions.update(group);
        })
        .catch((err) => {
          if (err) {
            GroupActions.update(null);
          }
        });
    }
  }
  delete(id) {
    request
      .post('/deleteGroup/' + id)
      .promise()
      .then((res) => {
        GroupActions.delete();
      })
      .catch((err) => {
        if (err) {
          GroupActions.delete(null);
        }
      });
  }
}
export default new GroupService();
