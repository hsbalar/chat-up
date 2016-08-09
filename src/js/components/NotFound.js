import React from 'react';
import { Link } from 'react-router';

class NotFound extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="error-page">
              <h1>Oops!</h1>
              <h2>404 Not Found</h2>
              <div className="error-details">
                Sorry, an error has occured, Requested page not found!
              </div>
              <div className="error-actions">
                <Link to="/" className="btn btn-primary">
                  <span className="glyphicon glyphicon-home"></span> Take Me
                  Home{' '}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
