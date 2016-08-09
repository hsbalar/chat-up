import passport from 'passport';

function encode(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    avatar: user.avatar,
  };
}

export function secured(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.xhr) {
    return res.status(401).end();
  }
  return res.redirect('/login');
}

export function requires(user, ...users) {
  return function (req, res, next) {
    let username = req.user && req.user.username;
    if (username && (username == user || users.indexOf(username) > -1)) {
      return next();
    }
    if (req.xhr) {
      return res.status(401).end();
    }
    return res.redirect('/login');
  };
}

export function currentUser(req, res, next) {
  if (req.user) {
    return res.json({
      user: encode(req.user),
    });
  }
  return res.status(401).end();
}

export function signIn(req, res, next) {
  let authenticator = passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user === false) {
      if (req.xhr) {
        return res.status(401).end();
      }
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      if (req.xhr) {
        return res.json({ user: encode(user) });
      }
      return res.redirect('/');
    });
  });

  return authenticator(req, res, next);
}

export function signOut(req, res, next) {
  req.logout();
  if (req.xhr) {
    return res.status(204).end();
  }
  return res.redirect('/');
}
