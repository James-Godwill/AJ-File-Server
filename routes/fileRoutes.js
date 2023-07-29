/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const authController = require('../controllers/authController');

const {
  getAllFiles,
  createFile,
  uploadFile,
  searchFile,
  deleteFile,
  updateFile,
} = require('../controllers/fileController');

const app = express();

const router = express.Router();

//File Routes For File Server Projecte
router.route('/').get(authController.protect, getAllFiles);

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
