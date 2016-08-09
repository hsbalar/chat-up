import mongoose, { Schema } from 'mongoose';

const TempMessage = new Schema({
  message: {
    type: String,
    trim: true,
  },
});
export default mongoose.model('TempMessage', TempMessage);
