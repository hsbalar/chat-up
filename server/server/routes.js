export default function (app) {
  require('../routes')(app);

  app.use('*', (req, res) => {
    res.render('index.html');
  });
}
