/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');
const catchAsync = require('../utils/catchAsync');

const {
  getAllFiles,
  createFile,
  sendFileAsMail,
  downloadFile,
  uploadFile,
  searchFile,
  updateFile,
} = require('../controllers/fileController');

const app = express();

const router = express.Router();

//File Routes For File Server Projecte
router.route('/').get(authController.protect, getAllFiles);

//Code to implement file download
router.get('/single/:filename', downloadFile);

//Code to implement email sending to user
router.get('/sendMail/:email', sendFileAsMail);

//Route for users to search a file from server
router.route('/:name').get(authController.protect, searchFile);

//Route to update file
router.patch('/:id', authController.protect, updateFile);

//Route for admin to create new file
router.post(
  '/createfile',

  authController.protect,
  authController.restrictTo('admin'),
  uploadFile,
  createFile,
);

module.exports = router;
