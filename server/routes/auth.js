import * as auth from '../middleware/auth';

export default function (app) {
  app.get('/auth', auth.currentUser);
  app.post('/auth', auth.signIn);
  app.all('/signout', auth.signOut);
}
