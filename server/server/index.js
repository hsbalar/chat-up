import http from 'http';
import config from './config';
import mongodb from './mongodb';
import sockets from './sockets';
import passport from './passport';
import application from './express';

let app = null;

export function init() {
  return new Promise((resolve, reject) => {
    mongodb((err, db) => {
      if (err) {
        return reject(err);
      }

      let server;

      app = application(db);
      server = http.createServer(app);

      app.db = db;
      app.server = server;
      app.config = config;

      passport(app);
      app.socketio = sockets(server);

      require('./routes')(app);

      app.socketio.on('connection', (socket) => {
        require('../routes/socket')(app, socket);
      });

      app.server.listen(process.env.PORT || 3000, () => {
        return resolve(true);
      });
    });
  });
}
