import Message from '../models/Message';
import TempMessage from '../models/TempMessage';
import _ from 'lodash';

function encodeMessage(message) {
  return message.body + ',' + message.sendDate + ',' + message.sender;
}

export function create(req, res, next) {
  let message = new Message();
  message = _.assign(message, req.body);

  message.save(function (err, message) {
    if (err) {
      console.log('Error: ' + err);
    }
    return res.json({ message: 'Done' });
  });
}

export function createCustomRoom(req, res, next) {
  let tempMessage = new TempMessage();
  tempMessage.message = 'fake';
  tempMessage.save(function (err, data) {
    if (err) {
      console.log('Error: ' + err);
    }
    return res.json({ roomId: data._id });
  });
}

export function loadPrevMessages(req, res, next) {
  let sid = req.query.sid;
  let rid = req.query.rid;
  let isGroup = req.query.isGroup;
  if (isGroup === 'true') {
    Message.find({ receivers: rid }).exec((err, messages) => {
      if (err) {
        return err;
      }
      return res.json({ messages: messages.map(encodeMessage) || {} });
    });
  } else {
    Message.find({
      sender: { $in: [sid, rid] },
      receivers: { $in: [sid, rid] },
    }).exec((err, messages) => {
      if (err) {
        return err;
      }
      return res.json({ messages: messages.map(encodeMessage) || {} });
    });
  }
}
