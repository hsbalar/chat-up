import React from 'react';
import router from '../services/RouterService';
import { Link, RouteHandler } from 'react-router';
import AppStore from '../stores/AppStore';
import ChatStore from '../stores/ChatStore';
import AppService from '../services/AppService';
import ChatService from '../services/ChatService';
import ChatWindow from '../components/chat/ChatWindow1';
import _ from 'lodash';

class App extends React.Component {
  static load(params, query) {
    if (ChatStore.users) {
      return null;
    }
    return ChatService.loadUser().then(() => {
      return ChatService.loadGroup().then(() => {});
    });
  }

  constructor(props) {
    super(props);
    this.data = {
      uname: '',
      users: ChatStore.chatusers || {},
      groups: ChatStore.chatgroups || {},
      rooms: ChatStore.getRooms() || {},
      onlineUsers: ChatStore.getOnlineUsers() || {},
      customGroup: false,
      chatListType: true,
      roomUsers: [],
      receiverID: '',
      rec: '',
    };

    this.state = this.getLoginState();

    // bind methods
    this.onChange = this.onChange.bind(this);
    this.onChatChange = this.onChatChange.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this.onChange);
    ChatStore.addChangeListener(this.onChatChange);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onChange);
    ChatStore.addChangeListener(this.onChatChange);
  }

  onChange() {
    this.setState(this.getLoginState());
  }

  onChatChange() {
    this.data.onlineUsers = ChatStore.getOnlineUsers() || [];
    this.data.users = ChatStore.chatusers || {};
    this.data.groups = ChatStore.chatgroups || {};
    this.data.rooms = ChatStore.getRooms() || {};
    this.setState(this.data);
  }

  getLoginState() {
    return {
      user: AppStore.user,
      isLoggedIn: AppStore.isLoggedIn(),
    };
  }
  onCreateCustomGroup(e) {
    e.preventDefault();
    this.data.customGroup = false;
    this.setState(this.data);
    if (!_.isEmpty(this.data.roomUsers))
      ChatService.createCustomRoom(this.data.roomUsers);
  }
  createRoom(e, rid, name, type) {
    if (!this.state.isLoggedIn) {
      return <ul className="nav navbar-nav navbar-right"></ul>;
    }
    e.preventDefault();
    this.data.receiverID = rid;
    this.data.uname = name;
    this.setState(this.data);

    if (type === 'group') {
      this.data.rec = 'group';
      this.setState(this.data);
      ChatService.createRoom(rid, this.data.rec, name);
    } else {
      this.data.rec = 'user';
      ChatService.createRoom(rid, this.data.rec, name);
    }
  }

  onSearchChange(e) {
    if (this.data.chatListType) {
      if (_.isEmpty(_.trim(e.target.value))) {
        ChatService.loadUser();
      } else {
        ChatService.searchUser(e.target.value);
      }
    } else {
      if (_.isEmpty(_.trim(e.target.value))) {
        ChatService.loadGroup();
      } else {
        ChatService.searchGroup(e.target.value);
      }
    }
  }

  onCreateGroupClick(e, value) {
    e.preventDefault();
    this.data.chatListType = true;
    this.data.customGroup = value;
    this.setState(this.data);
  }
  onChatListTypeClick(e, value) {
    e.preventDefault();
    if (this.data.chatListType) {
      this.data.chatListType = false;
    } else {
      this.data.chatListType = true;
    }
    this.setState(this.data);
  }
  onSelectUserChange(userId, username) {
    let user = userId + ',' + username;
    let index = this.data.roomUsers.indexOf(
      this.state.roomUsers.filter((ele) => {
        return String(ele) === String(user);
      })[0]
    );
    if (index !== -1) this.data.roomUsers.splice(index, 1);
    else {
      this.data.roomUsers.push(user);
    }
    this.setState(this.data);
  }

  onLogout(e) {
    e.preventDefault();
    AppService.logout();
    let link = document.createElement('a');
    link.innerHTML = 'signout';
    link.href = '/signout';
    link.click();
  }

  getChatWindow(user) {
    let that = this;

    function createChat(room, i) {
      return (
        <ChatWindow
          room={room}
          receiverID={that.data.receiverID}
          no={i++}
          key={i}
        />
      );
    }

    function renderList(user, i) {
      let online = '';
      if (_.includes(that.data.onlineUsers, user._id)) {
        online = 'online';
      }
      if (AppStore.user.id === user._id) {
        return;
      }

      return (
        <tr key={i++}>
          <td>
            <a
              href=""
              style={{ textDecoration: 'none' }}
              onClick={(e) =>
                that.createRoom(e, user._id, user.fullName, 'user')
              }
            >
              <div className="col-md-3 col-xs-3 avatar">
                <img
                  src={user.avatar}
                  className="img-circle img-responsive"
                  style={{ maxWidth: '35px', maxHeight: '35px' }}
                />
              </div>
              <div className="col-md-9 col-xs-9">
                <h5 className="list-group-item-heading count">
                  {user.fullName}
                </h5>
                <p className="list-group-item-text">
                  <time style={{ fontSize: '10px', color: 'green' }}>
                    {online}
                  </time>
                </p>
              </div>
            </a>
          </td>
        </tr>
      );
    }

    function renderGroupList(group, i) {
      return (
        <tr key={i + 2}>
          <td>
            <a
              href=""
              onClick={(e) =>
                that.createRoom(e, group._id, group.name, 'group')
              }
              style={{ textDecoration: 'none' }}
            >
              <div className="col-md-3 col-xs-3 avatar">
                <img
                  src={group.avatar}
                  className="img-circle img-responsive"
                  style={{ height: '25px' }}
                />
              </div>
              <div className="col-md-9 col-xs-9">
                <h5 className="list-group-item-heading count">{group.name}</h5>
              </div>
            </a>
          </td>
        </tr>
      );
    }

    function renderUserSelectList(user, i) {
      let online = '';
      if (_.includes(that.data.onlineUsers, user._id)) {
        online = 'online';
      }

      if (AppStore.user.id === user._id) {
        return;
      }

      return (
        <tr key={i++}>
          <td>
            <a href="#" style={{ textDecoration: 'none' }}>
              <div className="checkbox">
                <div className="col-md-2 col-xs-2">
                  <label style={{ fontSize: '1em' }}>
                    <input
                      type="checkbox"
                      onClick={(e) =>
                        that.onSelectUserChange(user._id, user.fullName)
                      }
                    />
                    <span className="cr">
                      <i className="cr-icon fa fa-check"></i>
                    </span>
                  </label>
                </div>

                <div className="col-md-3 col-xs-3 avatar">
                  <img
                    src={user.avatar}
                    className="img-circle img-responsive"
                  />
                </div>
                <div className="col-md-7 col-xs-7">
                  <h5 className="list-group-item-heading">{user.fullName}</h5>
                  <p className="list-group-item-text">
                    <time style={{ fontSize: '10px', color: 'green' }}>
                      {online}
                    </time>
                  </p>
                </div>
              </div>
            </a>
          </td>
        </tr>
      );
    }
    let toDisplay;
    if (that.data.customGroup) {
      toDisplay = (
        <div className="row chat-window">
          <div className="panel panel-default">
            <div className="panel-heading top-bar">
              <div className="col-md-8 col-xs-8">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-comment"></span> ChatUp
                </h3>
              </div>
              <div className="col-md-4 col-xs-4" style={{ textAlign: 'right' }}>
                <a
                  data-toggle="collapse"
                  data-target="#ChatList2"
                  href="#ChatList2"
                  className="collapsed"
                >
                  <span
                    id="minim_chat_window"
                    className="glyphicon glyphicon-minus icon_minim"
                  ></span>
                </a>
                <a>
                  <span
                    className="glyphicon glyphicon-remove icon_close"
                    data-id="chat_window_1"
                    style={{ cursor: 'pointer' }}
                  ></span>
                </a>
              </div>
            </div>
            <div id="ChatList2" className="panel-collapse collapse in">
              <div id="ChatUserList" className="panel-collapse collapse in">
                <div className="panel-body msg_container_base_main">
                  <div className="input-group c-search">
                    <input
                      type="text"
                      className="form-control"
                      id="contact-list-search"
                      onChange={that.onSearchChange.bind(that)}
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">
                        <span className="glyphicon glyphicon-search text-muted"></span>
                      </button>
                    </span>
                  </div>

                  <table className="table table-hover">
                    <tbody>{that.data.users.map(renderUserSelectList)} </tbody>
                  </table>
                </div>
              </div>
              <div className="panel-footer" style={{ height: '40px' }}>
                <a
                  style={{ textDecoration: 'none', width: '110px' }}
                  className="btn btn-default btn-xs"
                  role="button"
                  onClick={(e) => that.onCreateGroupClick(e, false)}
                >
                  Cancel
                </a>
                <a
                  style={{ textDecoration: 'none', width: '110px' }}
                  className="btn btn-primary btn-xs pull-right"
                  onClick={(e) => that.onCreateCustomGroup(e, true)}
                >
                  Add people
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      toDisplay = (
        <div className="row chat-window" id="myDiv">
          <div className="panel panel-default">
            <div className="panel-heading top-bar">
              <div className="col-md-8 col-xs-8">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-comment"></span> ChatUp
                </h3>
              </div>
              <div className="col-md-4 col-xs-4" style={{ textAlign: 'right' }}>
                <a
                  data-toggle="collapse"
                  data-target="#ChatList"
                  href="#ChatList"
                  className="collapsed"
                >
                  <span
                    id="minim_chat_window"
                    className="glyphicon glyphicon-minus icon_minim"
                  ></span>
                </a>
                <a>
                  <span
                    className="glyphicon glyphicon-remove icon_close"
                    data-id="chat_window_1"
                    style={{ cursor: 'pointer' }}
                  ></span>
                </a>
              </div>
            </div>
            <div id="ChatList" className="panel-collapse collapse in">
              <div id="ChatUserList" className="panel-collapse collapse in">
                <div className="panel-body msg_container_base_main">
                  <div className="input-group c-search">
                    <input
                      type="text"
                      className="form-control input-sm"
                      id="contact-list-search"
                      onChange={that.onSearchChange.bind(that)}
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default btn-sm" type="button">
                        <span className="glyphicon glyphicon-search text-muted"></span>
                      </button>
                      <button
                        className="btn btn-default btn-sm"
                        type="button"
                        onClick={(e) => that.onChatListTypeClick(e)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span
                          className={
                            that.data.chatListType
                              ? 'fa fa-users'
                              : 'fa fa-user'
                          }
                          title={
                            that.data.chatListType
                              ? 'Group List'
                              : 'Friends List'
                          }
                        ></span>
                      </button>
                      <button
                        className="btn btn-default btn-sm"
                        type="button"
                        onClick={(e) => that.onCreateGroupClick(e, true)}
                      >
                        <span
                          className="fa fa-user-plus"
                          style={{ cursor: 'pointer' }}
                          title="Create group with friends"
                        ></span>
                      </button>
                    </span>
                  </div>

                  <table className="table table-hover">
                    <tbody>
                      {that.data.chatListType
                        ? that.data.users.map(renderList)
                        : that.data.groups.map(renderGroupList)}{' '}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="main-chat-window">
        {toDisplay}
        {that.data.rooms.map(createChat)}
      </div>
    );
  }
  getHeaderItems(user) {
    if (!this.state.isLoggedIn) {
      return <ul className="nav navbar-nav navbar-right"></ul>;
    }

    return (
      <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown">
            <i className="glyphicon glyphicon-user"></i>{' '}
            <span className="hidden-phone ng-binding">{user.fullName}</span>{' '}
            <b className="caret"></b>
          </a>
          <ul className="dropdown-menu">
            <div className="arrow"></div>
            <li>
              <a href="#">
                <i className="fa fa-cog"></i> Profile
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-info-circle"></i> About
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#" onClick={(e) => this.onLogout(e)}>
                <i className="fa fa-power-off"></i> Log out
              </a>
            </li>
          </ul>
        </li>
      </ul>
    );
  }

  render() {
    let cwin = null;
    if (!AppStore.isLoggedIn()) {
      cwin = <div></div>;
    } else {
      cwin = this.getChatWindow(this.state.user);
    }
    return (
      <div>
        <header
          id="header"
          role="header"
          className="navbar navbar-inverse navbar-fixed-top"
        >
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target=".navbar-collapse"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/" className="navbar-brand">
                ChatUp
              </Link>
            </div>
            <nav className="collapse navbar-collapse">
              {this.getHeaderItems(this.state.user)}
            </nav>
          </div>
        </header>
        <div className="container">
          <RouteHandler {...this.props} />
        </div>
        {cwin}
      </div>
    );
  }
}

export default App;
