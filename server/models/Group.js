import mongoose, { Schema } from 'mongoose';

let Group = new Schema({
  groupName: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  avatar: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  adminName: {
    type: String,
    trim: true,
  },
  created: {
    type: String,
  },
});

export default mongoose.model('Group', Group);
