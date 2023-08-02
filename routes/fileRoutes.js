/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');
const catchAsync = require('../utils/catchAsync');

const {
  getAllFiles,
  createFile,
  sendFileAsMail,
  uploadFile,
  searchFile,
  deleteFile,
  updateFile,
} = require('../controllers/fileController');

const app = express();

const router = express.Router();

//File Routes For File Server Projecte
router.route('/').get(authController.protect, getAllFiles);

const folderPath = './public/uploads';

//Code to implement file download
router.get('/single/:filename', (req, res, next) => {
  const file = req.params.filename;
  res.download(`${folderPath}/${file}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

//Code to implement email sending to user
router.get('/sendMail/:email', sendFileAsMail);

//Route for users to search a file from server
router.route('/:name').get(authController.protect, searchFile);

//Router for users to delete a file from file server
router.delete('/:id', authController.protect, deleteFile);

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
