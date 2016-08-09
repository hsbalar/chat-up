import mongoose, { Schema } from 'mongoose';

const Message = new Schema({
  subject: {
    type: String,
    trim: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receivers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  body: {
    type: String,
    trim: true,
    required: 'Message Body Undefine',
  },
  attachments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
    },
  ],
  sendDate: String,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
});

export default mongoose.model('Message', Message);
