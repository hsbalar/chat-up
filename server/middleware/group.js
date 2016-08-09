import User from '../models/User';
import Group from '../models/Group';
import _ from 'lodash';
import fs from 'fs';

function encodeGroup(group) {
  return {
    _id: group._id,
    name: group.groupName,
    description: group.description,
    adminName: group.adminName,
    created: group.created,
    comments: group.comments,
  };
}

function encodeChatGroup(group) {
  return {
    _id: group._id,
    name: group.groupName,
    avatar: group.avatar,
  };
}

export function loadImage(req, res, next) {
  let group = req.group || new Group();
  if (!group.avatar || !group.avatar.data) {
    return res.redirect('/images/group-default.png');
  }
  res.send(group.avatar.data);
}

export function list(req, res, next) {
  let page = req.query.page;
  if (page > 0 && page <= Group.count()) {
    let start = page > 0 ? (page - 1) * 5 : 0;
    let end = 5;
    Group.find()
      .skip(start)
      .limit(end)
      .populate('comments')
      .exec((err, groups) => {
        if (err) {
          return next(err);
        }
        if (groups) {
          Group.count({}, function (err, count) {
            if (err) {
              return err;
            }
            res.json({
              groups: groups.map(encodeGroup),
              count: count,
              startPage: start,
            });
          });
        }
      });
  }
}

export function chatGroupList(req, res) {
  Group.find().exec((err, groups) => {
    if (err) {
      return err;
    }
    if (groups) {
      return res.json({ groups: groups.map(encodeChatGroup) });
    }
  });
}
export function searchChatGroupList(req, res, next) {
  let toSearch = req.query.search;
  let regex = new RegExp(toSearch, 'gi');

  Group.find({ $or: [{ groupName: regex }, { adminName: regex }] }).exec(
    (err, groups) => {
      if (err) {
        return next(err);
      }
      if (groups) {
        res.json({ groups: groups.map(encodeChatGroup) });
      }
    }
  );
}

export function search(req, res, next) {
  let toSearch = req.query.search.trim();
  let regex = new RegExp(toSearch, 'gi');

  Group.find({ $or: [{ name: regex }, { adminName: regex }] })
    .populate('comments')
    .exec((err, groups) => {
      if (err) {
        return next(err);
      }
      if (groups) {
        res.json({ groups: groups.map(encodeGroup) });
      }
    });
}

export function postComment(req, res, next) {
  let group = req.group;

  let username = req.user.fullName;
  let body = req.body.content;
  let postDate = new Date().toString();

  group.comments.push({ username: username, body: body, date: postDate });

  group.save(function (err) {
    if (err) {
      console.log('Error: ' + err);
    }
    return res.json();
  });
}

export function loadUserGroup(req, res, next) {
  let id = req.query.id;
  let query = User.findOne({ _id: id });
  query.select('groups');
  query.exec((err, user) => {
    if (err) {
      return next(err);
    }
    Group.find({ _id: { $nin: user.groups } }).exec((err, groups) => {
      if (err) {
        return next(err);
      }
      if (groups) {
        return res.json({ groups: groups });
      }
    });
  });
}

export function create(req, res, next) {
  let group = new Group();
  group = _.assign(group, req.body);
  group.admin = req.user._id;
  group.adminName = req.user.fullName;

  let date = new Date().toString().split(' ').splice(1, 2).join(' ');
  let year = new Date().toString().split(' ').splice(3, 1);
  let time = new Date().toString().split(' ').splice(4);
  let onlyTime = time.toString().split(':').splice(0, 2).join(':');
  group.created = date + "' " + year + ' at ' + onlyTime;

  if (!group.avatar) {
    group.avatar = {};
  }

  if (req.files.avatar) {
    group.avatar.data = fs.readFileSync(req.files.avatar.path);
    group.avatar.contentType = req.files.avatar.mimetype;
    group.avatar.name = req.files.avatar.originalname;
  }

  group.save(function (err, group) {
    if (err) {
      return next(err);
    }
    return res.json(group);
  });
}

export function update(req, res) {
  let group = req.group || new Group();
  group = _.assign(group, req.body);

  if (!group.avatar) {
    group.avatar = {};
  }

  if (req.files.avatar) {
    group.avatar.data = fs.readFileSync(req.files.avatar.path);
    group.avatar.contentType = req.files.avatar.mimetype;
    group.avatar.name = req.files.avatar.originalname;
  }

  group.save(function (err, group) {
    if (err) {
      console.log('Error: ' + err);
    }
    return res.json(group);
  });
}

export function deleteGroup(req, res) {
  let group = req.group;
  if (group) {
    group.remove();
    return res.json();
  }
}

export function findById(req, res, next) {
  let id = req.params.id1;
  if (id === '_') {
    return next();
  }
  Group.findById(id).exec(function (err, group) {
    if (err) {
      return next(err);
    }

    if (!group) {
      return next(new Error('Failed to load group: ' + id));
    }
    req.group = group;
    next();
  });
}
