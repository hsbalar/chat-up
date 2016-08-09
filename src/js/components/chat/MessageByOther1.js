import React from 'react';

class MessageByOther1 extends React.Component {
  render() {
    let image = this.props.imageId;
    return (
      <div className="row msg_container base_receive">
        <div className="col-md-3 col-xs-3 avatar">
          <img src={image} className="img-circle img-responsive " />
        </div>
        <div className="col-md-9 col-xs-9">
          <div className="messages msg_receive">
            <p>{this.props.message}</p>
            <time>
              <span className="glyphicon glyphicon-time"></span>{' '}
              {this.props.postTime}
            </time>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageByOther1;
