const express = require('express');
const authController = require('../controllers/authController');

const app = express();

const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword,
);

router.get('/logout', authController.logout);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.get('/', getAllUsers);

module.exports = router;
