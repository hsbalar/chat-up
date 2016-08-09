import React from 'react';
import Router, { Route, DefaultRoute, NotFoundRoute } from 'react-router';
import App from './components/App';
import Home from './components/index';
import secured from './components/secured';
import EditUser from './components/EditUser';
import NotFound from './components/NotFound';
import { Login, Logout } from './components/Login';
import * as RouterService from './services/RouterService';

import AppService from './services/AppService';

const routes = (
  <Route name="home" handler={App} path="/">
    <Route name="login" handler={Login} />
    <Route name="logout" handler={Logout} />
    <Route name="signup" handler={EditUser} />
    <DefaultRoute handler={secured(Home)} />
  </Route>
);

const router = Router.create({
  routes: routes,
  location: Router.HistoryLocation,
});

RouterService.register(router);

function fetchData(state) {
  let { routes, params, query } = state;
  return Promise.all(
    routes
      .filter((route) => route.handler.load)
      .map((route) => route.handler.load(params, query))
      .filter((promise) => promise instanceof Promise)
  );
}

function run() {
  router.run((Handler, state) => {
    fetchData(state).then(() => {
      React.render(<Handler {...state} />, document.getElementById('content'));
    });
  });
}

AppService.init().then(run);
