import request from '../common/request';
import UserActions from '../actions/UserActions';

class UserService {
  load(query) {
    return request
      .get('/listUser')
      .query(query)
      .promise()
      .then((res) => {
        let users = res.body.users;
        let count = res.body.count;
        let startPage = res.body.startPage;
        UserActions.list(users, query, count, startPage);
      })
      .catch((err) => {
        if (err) {
          UserActions.list(null, null);
        }
      });
  }

  search(search) {
    return request
      .get('/userSearch')
      .query({ search: search })
      .promise()
      .then((res) => {
        let users = res.body.users;
        let count = users.length;
        let startPage = 1;
        UserActions.list(users, count, startPage);
      })
      .catch((err) => {
        if (err) {
          UserActions.list(null, null);
        }
      });
  }

  uploadAvatar(avatar) {
    return request
      .post('/saveAvatar')
      .attach('file', avatar)
      .promise()
      .then((res) => {
        let file = res.body.filename;
        return file;
      })
      .catch((err) => {
        if (err) {
        }
      });
  }

  create(item) {
    request
      .post('/saveUser')
      .send(item)
      .promise()
      .then((res) => {
        let newUser = res.body;
        UserActions.create(newUser);
      })
      .catch((err) => {
        if (err) {
          UserActions.create(null);
        }
      });
  }
  update(item) {
    if (item.avatar) {
      let avatar = item.avatar;
      delete item.avatar;
      request
        .post('/updateUser/' + item._id)
        .attach('avatar', avatar, avatar.name)
        .field('firstName', item.firstName)
        .field('lastName', item.lastName)
        .field('email', item.email)
        .field('username', item.username)
        .field('password', item.password)
        .then((res) => {
          let user = res.body;
          UserActions.update(user);
        })
        .catch((err) => {
          if (err) {
            UserActions.update(null);
          }
        });
    } else {
      request
        .post('/updateUser/' + item._id)
        .send(item)
        .promise()
        .then((res) => {
          let user = res.body;
          UserActions.update(user);
        })
        .catch((err) => {
          if (err) {
            UserActions.update(null);
          }
        });
    }
  }
  delete(id, index) {
    request
      .post('/deleteUser/' + id)
      .promise()
      .then((res) => {
        UserActions.delete(index);
      })
      .catch((err) => {
        if (err) {
          UserActions.delete(null);
        }
      });
  }
}
export default new UserService();
