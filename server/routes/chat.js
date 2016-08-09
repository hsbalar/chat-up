import * as chat from '../middleware/chat';

export default function (app) {
  app.get('/loadPrevMessages', chat.loadPrevMessages);
  app.get('/createCustomRoom', chat.createCustomRoom);
  app.post('/newMessage', chat.create);
}
