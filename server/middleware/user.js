import User from '../models/User';
import _ from 'lodash';
import fs from 'fs';

function encodeUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    groups: user.groups,
    createdAt: user.createdAt,
  };
}

function encodeChatUserList(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    avatar: user.avatar,
  };
}

export function loadImage(req, res, next) {
  let user = req.user || new User();
  if (!user.avatar || !user.avatar.data) {
    return res.redirect('/images/user-default.jpg');
  }
  res.send(user.avatar.data);
}
export function list(req, res, next) {
  let page = req.query.page;
  if (page > 0 && page <= User.count()) {
    let start = page > 0 ? (page - 1) * 5 : 0;
    let end = 5;
    User.find()
      .skip(start)
      .limit(end)
      .populate('groups')
      .exec((err, users) => {
        if (err) {
          return next(err);
        }
        if (users) {
          User.count({}, function (err, count) {
            if (err) {
              return err;
            }
            res.json({
              users: users.map(encodeUser),
              count: count,
              startPage: start,
            });
          });
        }
      });
  }
}

export function chatUserList(req, res) {
  User.find().exec((err, users) => {
    if (err) {
      return err;
    }
    if (users) {
      return res.json({ users: users.map(encodeChatUserList) });
    }
  });
}

export function searchChatUserList(req, res, next) {
  let toSearch = req.query.search.trim();
  let regex = new RegExp(toSearch, 'gi');

  User.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { username: regex },
      { email: regex },
    ],
  }).exec((err, users) => {
    if (err) {
      return next(err);
    }
    if (users) {
      res.json({ users: users.map(encodeChatUserList) });
    }
  });
}

export function search(req, res, next) {
  let toSearch = req.query.search.trim();
  let regex = new RegExp(toSearch, 'gi');

  User.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { username: regex },
      { email: regex },
    ],
  })
    .populate('groups')
    .exec((err, users) => {
      if (err) {
        return next(err);
      }
      if (users) {
        res.json({ users: users.map(encodeUser) });
      }
    });
}

export function subscribeToGroup(req, res, next) {
  let user = req.user;
  user.groups = user.groups.concat(req.query.groupId);
  user.save(function (err) {
    if (err) {
      console.log('Error: ' + err);
    }
    return res.json();
  });
}
export function unsubscribeFromGroup(req, res, next) {
  let groupId = req.query.groupId;
  let user = req.user;
  user.groups.splice(groupId, 1);
  user.save(function (err) {
    if (err) {
      console.log('Error: ' + err);
    }
    return res.json();
  });
}
export function create(req, res, next) {
  if (!req.body.avatar) {
    req.body.avatar = 'user-default.jpg';
  }
  let user = new User();
  user = _.assign(user, req.body);

  let date = new Date().toString().split(' ').splice(1, 2).join(' ');
  let year = new Date().toString().split(' ').splice(3, 1);
  let time = new Date().toString().split(' ').splice(4);
  let onlyTime = time.toString().split(':').splice(0, 2).join(':');
  user.createdAt = date + "' " + year + ' at ' + onlyTime;

  user.save(function (err, user) {
    if (err) {
      return next(err);
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json(user);
    });
  });
}

export function update(req, res) {
  let user = req.user || new User();
  user = _.assign(user, req.body);

  if (!user.avatar) {
    user.avatar = {};
  }

  if (req.files.avatar) {
    user.avatar.data = fs.readFileSync(req.files.avatar.path);
    user.avatar.contentType = req.files.avatar.mimetype;
    user.avatar.name = req.files.avatar.originalname;
  }

  user.save(function (err, user) {
    if (err) {
      console.log('Error: ' + err);
    }
    return res.json(user);
  });
}

export function deleteUser(req, res) {
  let user = req.user;
  if (user) {
    user.remove();
    return res.json();
  }
}

export function findById(req, res, next) {
  let id = req.params.id;
  if (id === '_') {
    return next();
  }
  User.findById(id).exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new Error('Failed to load user: ' + id));
    }
    req.user = user;
    next();
  });
}
