import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import morgan from 'morgan';
import flash from 'connect-flash';

import fs from 'fs';
import path from 'path';

import session from './session';
import config from './config';

export default function () {
  let app = express();

  if (process.env.NODE_ENV === 'development') {
    app.set('view cache', false);
  }

  if (config.httpLogging.enable) {
    if (!fs.exists('log')) {
      fs.mkdirSync('log');
    }
    app.use(
      morgan(config.httpLogging.format, {
        stream: fs.createWriteStream(path.join('log', 'access.log'), {
          flags: 'a',
        }),
      })
    );
  }

  app.enable('jsonp callback');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(methodOverride());

  app.use(express.static(path.resolve('./public')));

  app.use(cookieParser(config.session.secret));
  app.use(session);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  app.use((err, req, res, next) => {
    res.json({ error: err }).end();
  });

  return app;
}
