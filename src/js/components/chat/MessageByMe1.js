import React from 'react';
import AppStore from '../../stores/AppStore';

class MessageByMe1 extends React.Component {
  render() {
    let image = AppStore.user.avatar;
    return (
      <div className="row msg_container base_sent">
        <div className="col-md-9 col-xs-9">
          <div className="messages msg_sent">
            <p>{this.props.message}</p>
            <time>
              <span className="glyphicon glyphicon-time"></span>{' '}
              {this.props.postTime}
            </time>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 avatar">
          <img src={image} className="img-circle img-responsive" />
        </div>
      </div>
    );
  }
}

export default MessageByMe1;
