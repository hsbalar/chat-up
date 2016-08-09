import AppStore from '../stores/AppStore';

import { Login } from './Login';

export default function secured(Component) {
  Component.willTransitionTo = function (transition) {
    if (!AppStore.isLoggedIn()) {
      Login.transition = transition;
      return transition.redirect('/login');
    }
  };
  return Component;
}
