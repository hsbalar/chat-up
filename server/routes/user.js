import * as auth from '../middleware/auth';
import * as user from '../middleware/user';
import cloudinary from 'cloudinary';

import multer from 'multer';
import path from 'path';

cloudinary.config({
  cloud_name: '...',
  api_key: '...',
  api_secret: '...',
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, `${Math.random().toString(36).substring(7)}${ext}`);
  },
});

let upload = multer({ storage: storage });

export default function (app) {
  app.get('/listUser', user.list);
  app.post('/saveUser', user.create);
  app.post('/saveAvatar', upload.single('file'), (req, res, next) => {
    let clf = req.file.filename.split('.');
    cloudinary.uploader.upload(
      './public/' + req.file.filename,
      (result) => {},
      {
        public_id: clf[0],
        width: 150,
        height: 150,
        crop: 'thumb',
        gravity: 'face',
        radius: 'max',
      }
    );
    res.json(req.file);
  });
  app.get('/userSearch', user.search);
  app.get('/chatUserList', user.chatUserList);
  app.get('/searchChatUserList', user.searchChatUserList);
  app.post('/updateUser/:id', user.update);
  app.post('/deleteUser/:id', user.deleteUser);
  app.post('/subscribeToGroup/:id', user.subscribeToGroup);
  app.post('/unsubscribeFromGroup/:id', user.unsubscribeFromGroup);
  app.get('/imageUser/:id', user.loadImage);
  app.param('id', user.findById);
}
