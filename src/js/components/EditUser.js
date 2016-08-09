import React from 'react';
import UserStore from '../stores/UserStore';
import UserService from '../services/UserService';
import { Link } from 'react-router';
import AppStore from '../stores/AppStore';
import AppService from '../services/AppService';

export default class UserEdit extends React.Component {
  static load(params, query) {}

  constructor(props) {
    super(props);
    this.state = {
      item: {},
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    jQuery(document.body).addClass('has-login');
  }

  componentWillUnmount() {
    jQuery(document.body).removeClass('has-login');
  }

  restryTransition() {
    let transition = UserEdit.transition;
    if (transition) {
      UserEdit.transition = null;
      transition.retry();
    } else {
      this.context.router.replaceWith('/');
    }
  }

  onChange(e) {
    if (e.target.name === 'firstName') {
      this.state.item.firstName = e.target.value;
    } else if (e.target.name === 'lastName') {
      this.state.item.lastName = e.target.value;
    } else if (e.target.name === 'username') {
      this.state.item.username = e.target.value;
    } else if (e.target.name === 'email') {
      this.state.item.email = e.target.value;
    } else if (e.target.name === 'password') {
      this.state.item.password = e.target.value;
    } else if (e.target.name === 'avatar') {
      let file = e.target.files[0];
      UserService.uploadAvatar(file).then((filename) => {
        this.state.item.avatar = filename;
        this.setState(this.state);
      });
    }
    this.setState(this.state);
  }

  onSubmit(e) {
    e.preventDefault();
    UserService.create(this.state.item);
  }

  render() {
    let image;
    let user;
    if (this.state.item.avatar) {
      image = this.state.item.avatar;
    } else {
      image = '/user-default.jpg';
    }
    if (AppStore.isLoggedIn()) {
      return null;
    }
    return (
      <div className="login-page">
        <form
          className="form-signin"
          method="post"
          onSubmit={this.onSubmit.bind(this)}
        >
          <h3 className="form-signin-heading">Create account</h3>
          <div className="avatar-area">
            <img src={image} className="avatar-signup" alt="" />
            <label
              htmlFor="file-pb"
              className="caption-signup"
              style={{ marginBottom: '0px' }}
            >
              Upload Photo
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="upload-file"
              style={{ display: 'none' }}
              id="file-pb"
              onChange={this.onChange}
            />
          </div>
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            required
            autofocus
            value={this.state.item.username}
            onChange={this.onChange}
          />
          <input
            type="text"
            name="firstName"
            className="form-control"
            placeholder="First Name"
            required
            value={this.state.item.firstName}
            onChange={this.onChange}
          />
          <input
            type="text"
            name="lastName"
            className="form-control"
            placeholder="Last Name"
            value={this.state.item.lastName}
            onChange={this.onChange}
          />
          <input
            type="text"
            name="email"
            className="form-control"
            placeholder="Email"
            value={this.state.item.email}
            onChange={this.onChange}
          />
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            required
            value={this.state.item.password}
            onChange={this.onChange}
          />
          <div className="checkbox" style={{ margin: '10px 0px 10px 0px' }}>
            <label style={{ fontSize: '1em' }}>
              <Link to="/login">Sign In</Link>
            </label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}

UserEdit.contextTypes = {
  router: React.PropTypes.func.isRequired,
};

export default UserEdit;
