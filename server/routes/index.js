import auth from './auth';
import user from './user';
import chat from './chat';
import group from './group';

export default function (app) {
  auth(app);
  user(app);
  group(app);
  chat(app);
}
