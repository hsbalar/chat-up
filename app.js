// register babel hook
require('babel-core/register')();

// start the server
require('./app/server')
  .init()
  .then(() => {
    console.log('Server started : 3000');
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
