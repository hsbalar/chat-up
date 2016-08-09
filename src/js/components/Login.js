import React from 'react';
import { Link } from 'react-router';
import router from '../services/RouterService';

import AppStore from '../stores/AppStore';
import AppService from '../services/AppService';

export class Login extends React.Component {
  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.restryTransition();
  }

  componentDidMount() {
    jQuery(document.body).addClass('has-login');
  }

  componentWillUnmount() {
    jQuery(document.body).removeClass('has-login');
  }

  restryTransition() {
    let transition = Login.transition;
    if (transition) {
      Login.transition = null;
      transition.retry();
    } else {
      this.context.router.replaceWith('/');
    }
  }

  onSubmit(e) {
    e.preventDefault();
    let username = this.refs.username.getDOMNode().value;
    let password = this.refs.password.getDOMNode().value;
    AppService.login(username, password).then(() => {
      this.restryTransition();
    });
  }

  render() {
    if (AppStore.isLoggedIn()) {
      return null;
    }
    return (
      <div className="login-page">
        <form className="form-signin" method="post" action="/auth">
          <h3 className="form-signin-heading">Please sign in</h3>
          <label htmlFor="inputUsername" className="sr-only">
            Username
          </label>
          <input
            type="text"
            ref="username"
            id="inputUsername"
            name="username"
            className="form-control"
            placeholder="Username"
            required
            autofocus
          />
          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            ref="password"
            id="inputPassword"
            name="password"
            className="form-control"
            placeholder="Password"
            required
          />
          <div className="checkbox" style={{ margin: '5px 0px 10px 0px' }}>
            <label style={{ fontSize: '1em' }}>
              <Link to="/signup">Create account</Link>
            </label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Sign in
          </button>
        </form>
      </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.func.isRequired,
};

export class Logout extends React.Component {
  componentWillMount() {
    AppService.logout();
  }

  render() {
    return null;
  }
}

Logout.contextTypes = {
  router: React.PropTypes.func.isRequired,
};

export default Login;
