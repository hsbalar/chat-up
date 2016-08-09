import * as auth from '../middleware/auth';
import * as group from '../middleware/group';

export default function (app) {
  app.get('/listGroup', group.list);
  app.get('/groupSearch', group.search);
  app.get('/chatGroupList', group.chatGroupList);
  app.get('/imageGroup/:id', group.loadImage);
  app.get('/searchChatGroupList', group.searchChatGroupList);
  app.post('/saveGroup', group.create);
  app.post('/updateGroup/:id', group.update);
  app.post('/deleteGroup/:id', group.deleteGroup);
  app.post('/loadUserGroup', group.loadUserGroup);
  app.post('/postComment/:id', group.postComment);
  app.param('id', group.findById);
}
