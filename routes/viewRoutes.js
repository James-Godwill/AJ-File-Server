const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/signup', viewController.signup);

router.get(
  '/feeds/:title',
  authController.isLoggedIn,
  viewController.getAllFiles,
);

router.get('/forgotpassword', viewController.forgot);

router.get('/aj/api/v1/users/resetpassword/:token', viewController.reset);

router.get('/sendMail/:objectName/:receiverEmail');

router.get('/previewer/:prevfile', viewController.preview);

router.get('/', viewController.base);

router.get('/upload', authController.isAdmin, viewController.upload);
module.exports = router;
