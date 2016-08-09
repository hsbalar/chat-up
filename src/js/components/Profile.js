import React from 'react';
import AppStore from '../stores/AppStore';
import { userStore } from '../stores/UserStore';
let counter = 0;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: AppStore.user,
    };
  }
  componentDidMount() {
    userStore.addChangeListener(this.onChange);
  }
  componentWillUnmount() {
    userStore.removeChangeListener(this.onChange);
  }

  render() {
    let image;
    let user = this.state.item.id;
    image = '/imageUser/' + user + '?' + ++counter;
    return (
      <div className="row">
        <br />
        <br />
        <br />
        <h3>My Profile</h3>
        <hr />
        <div className="col-sm-2 col-md-2">
          <img src={image} alt="" className="img-rounded img-responsive" />
        </div>
        <div className="col-sm-4 col-md-4">
          <blockquote>
            <p>{this.state.item.fullName}</p>{' '}
            <small>
              <cite title="Source Title">
                username is {this.state.item.username}{' '}
                <i className="glyphicon glyphicon-map-marker"></i>
              </cite>
            </small>
          </blockquote>
          <p>
            {' '}
            <i className="glyphicon glyphicon-envelope"></i>{' '}
            {this.state.item.email}
          </p>
          <p>
            <br />
            <br />
            <br />
            <br />
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Update{' '}
              </button>
            </div>
          </p>
        </div>
      </div>
    );
  }
}
export default Profile;
