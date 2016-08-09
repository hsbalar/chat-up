import React from 'react';
import MessageByMe1 from './MessageByMe1';
import MessageByOther1 from './MessageByOther1';
import ChatService from '../../services/ChatService';
import ChatStore from '../../stores/ChatStore';
import AppStore from '../../stores/AppStore';
import io from 'socket.io-client';
import _ from 'lodash';

const socket = io.connect();

class ChatWindow1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      room: this.props.room,
      receiverID: this.props.receiverID,
      messages: [],
      chatText: '',
      recType: '',
      typeDisplay: '',
    };
    this.shouldScrollBottom = null;
    if (this.state.receiverID === '') {
      this.state.receiverID = ChatStore.getReceiverID(this.state.room);
    }
    this.state.messages = ChatStore.getMessages(this.state.room);
    this.state.uname = ChatStore.getDisplayName(this.state.room);
    this.state.recType = ChatStore.getRecType(this.state.room);
  }

  onChange() {
    this.state.room = this.props.room;
    this.setState(this.state);
    this.state.messages = ChatStore.getMessages(this.state.room);
    this.state.uname = ChatStore.getDisplayName(this.state.room);
    this.state.recType = ChatStore.getRecType(this.state.room);
    if (this.state.receiverID === '') {
      this.state.receiverID = ChatStore.getReceiverID(this.state.room);
    }
    this.setState(this.state);
  }

  componentWillUpdate() {
    let node = this.refs.messageList.getDOMNode();
    this.shouldScrollBottom =
      node.scrollTop + node.offsetHeight === node.scrollHeight;
  }
  componentDidUpdate() {
    this.scrollToBottom();
    if (this.shouldScrollBottom) {
      let node = this.refs.messageList.getDOMNode();
      node.scrollTop = node.scrollHeight;
    }
  }

  componentDidMount() {
    ChatStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnmount() {
    ChatStore.removeChangeListener(this.onChange.bind(this));
  }

  scrollToBottom() {
    let ul = this.refs.messageList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  }

  onTextChange(e) {
    e.preventDefault();
    this.state.chatText = e.target.value;
    this.setState(this.state);
    if (this.state.chatText !== '') {
      let typing = true;
      socket.emit(
        'on:typingmessage',
        typing,
        this.state.room,
        this.state.receiverID
      );
    } else {
      let typing = false;
      socket.emit(
        'on:typingmessage',
        typing,
        this.state.room,
        this.state.receiverID
      );
    }

    socket.on('on:typing', (data) => {
      if (data.typing === true) {
        this.state.typeDisplay = ' is typing';
        this.setState(this.state);
        document.getElementById('isTyping').style.visibility = 'visible';
      } else {
        console.log('In Else');
        this.state.typeDisplay = '';
        this.setState(this.state);
        document.getElementById('isTyping').style.visibility = 'hidden';
      }
    });
  }

  onCloseChatWindow(e, roomId) {
    e.preventDefault();
    ChatService.disconnectRoom(roomId);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!_.isEmpty(this.state.chatText)) {
      this.state.messages.push(
        this.state.chatText +
          ',' +
          new Date().toString() +
          ',' +
          AppStore.user.id
      );
      React.findDOMNode(this.refs.chatBox).value = '';

      ChatService.post(
        this.state.chatText.trim(),
        this.state.room,
        this.state.receiverID,
        this.state.recType
      );
      let typing = false;
      socket.emit(
        'on:typingmessage',
        typing,
        this.state.room,
        this.state.receiverID
      );
      this.state.chatText = '';
      this.setState(this.state);
    }
  }

  render() {
    let n = this.props.no;
    let image;
    function renderMessage(me) {
      let MessageBy;
      let data = me.split(',');
      image = data[2];

      let date = new Date(data[1]).toString().split(' ').splice(1, 2).join(' ');
      let temp = new Date(data[1]).toString().split(' ').splice(4);
      let time = temp.toString().split(':').splice(0, 2).join(':');
      let onlyTime = date + ' ' + time;

      if (data[2] === AppStore.user.id) {
        MessageBy = (
          <MessageByMe1 message={data[0]} postTime={onlyTime} i={n++} />
        );
      } else {
        MessageBy = (
          <MessageByOther1
            message={data[0]}
            postTime={onlyTime}
            i={n++}
            imageId={data[2]}
          />
        );
      }
      return { MessageBy };
    }

    return (
      <div className="row chat-window" id={this.state.room}>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div className="panel panel-default">
            <div className="panel-heading top-bar">
              <div className="col-md-8 col-xs-8">
                <h4 className="panel-title">
                  <span className="glyphicon glyphicon-comment"></span>{' '}
                  {this.state.uname}{' '}
                </h4>
              </div>
              <div className="col-md-4 col-xs-4" style={{ textAlign: 'right' }}>
                <a
                  data-toggle="collapse"
                  data-target={'#' + n}
                  href={'#' + n}
                  className="collapsed"
                >
                  <span
                    id="minim_chat_window"
                    className="glyphicon glyphicon-minus icon_minim"
                  ></span>
                </a>
                <a onClick={(e) => this.onCloseChatWindow(e, this.state.room)}>
                  <span
                    className="glyphicon glyphicon-remove icon_close"
                    data-id="chat_window_1"
                    style={{ cursor: 'pointer' }}
                  ></span>
                </a>
              </div>
            </div>
            <div id={n} className="panel-collapse collapse in">
              <div
                className="panel-body msg_container_base"
                style={{ height: '500px' }}
                ref="messageList"
              >
                {this.state.messages.map(renderMessage)}
                <div
                  id="isTyping"
                  className="base_receive"
                  style={{ visibility: 'hidden' }}
                >
                  <div className="col-md-3 col-xs-3 avatar">
                    <img src={image} className="img-circle img-responsive " />
                  </div>
                  <div className="col-md-9 col-xs-9">
                    <div className="typing_container msg_receive">
                      <div className="typing_loader"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-footer">
                <div className="input-group">
                  <input
                    id="btn-input"
                    onChange={(e) => this.onTextChange(e)}
                    type="text"
                    ref="chatBox"
                    className="form-control input-sm"
                    placeholder="Write your message here..."
                  />
                  <span className="input-group-btn">
                    <button
                      className="btn btn-primary btn-sm"
                      id="btn-chat"
                      title="Send"
                    >
                      <span className="fa fa-sign-in"></span>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ChatWindow1;
