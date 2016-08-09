import request from '../common/request';
import AppActions from '../actions/AppActions';

class AppService {
  init() {
    return request
      .get('/auth')
      .promise()
      .then((res) => {
        let user = res.body.user;
        AppActions.init(user);
      })
      .catch(() => {
        AppActions.init(null);
      });
  }

  login(username, password) {
    return request
      .post('/auth')
      .send({
        username: username,
        password: password,
      })
      .promise()
      .then(function (res) {
        let user = res.body.user;
        AppActions.login(user);
      });
  }

  logout() {
    return request.get('/signout').then(function (res) {
      AppActions.logout();
    });
  }
}

export default new AppService();
