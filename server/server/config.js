// mongodb configuration
export default {
  database: {
    url: 'mongodb://localhost/chatup-db',
    options: {
      user: '',
      pass: '',
    },
    migrate: true,
    demo: true,
  },

  session: {
    name: 'sessionid',
    secret: 'secret',
    cookie: {
      path: '/',
      secure: false,
      maxAge: 3600000,
    },
  },

  httpLogging: {
    enable: false,
    format: 'combined',
  },

  server: {
    host: 'localhost',
    port: 3000,
  },
};
