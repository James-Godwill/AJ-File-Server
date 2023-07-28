/* eslint-disable import/no-extraneous-dependencies */
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUsers = (_req, res) => {};

exports.createUser = (_req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

exports.updateUser = (_req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

exports.deleteUser = (_req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};
