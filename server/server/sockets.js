import glob from 'glob';
import path from 'path';
import sio from 'socket.io';

import passport from 'passport';
import session from './session';

function authorize(socket, next) {
  let request = socket.request;
  let session = request.session;

  if (!session) {
    return next(new Error('No session found.'));
  }
  if (!session.passport) {
    return next(new Error('Passport not initialized.'));
  }

  let uid = session.passport.user;
  if (!uid) {
    return next(new Error('Not authorized.'));
  }

  passport.deserializeUser(uid, socket.request, function (err, user) {
    if (err) {
      return next(new Error('User not found.'));
    }
    request.user = user;
    return next();
  });
}

export default function (server) {
  let io = sio(server);

  // authorization support
  io.use((socket, next) => session(socket.request, {}, next));
  io.use(authorize);

  io.on('connection', (socket) => {
    // load all socket handlers
    glob.sync('./app/sockets/**/*.js').forEach((file) => {
      require(path.resolve(file))(socket);
    });
  });

  return io;
}
