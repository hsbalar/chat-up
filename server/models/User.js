import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const User = new Schema({
  avatar: String,
  firstName: {
    type: String,
    trim: true,
    required: 'Please provide first name',
  },
  lastName: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    unique: 'Username already exists',
    require: 'Please provide a username',
  },
  password: {
    type: String,
    required: 'Please provide a password',
  },
  meta: {
    type: Schema.Types.Mixed,
  },
});

User.virtual('fullName').get(function () {
  return (this.firstName + ' ' + this.lastName).trim();
});

User.pre('save', function (next) {
  let user = this;

  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

User.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, matched) => {
    if (err) {
      return callback(err);
    }
    return callback(null, matched);
  });
};

export default mongoose.model('User', User);
