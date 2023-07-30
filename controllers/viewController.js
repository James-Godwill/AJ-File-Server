//rendering pug template
const catchAsync = require('../utils/catchAsync');
const File = require('../models/fileModel');

exports.signup = (req, res) => {
  res.status(200).render('signup');
};

exports.getAllFiles = catchAsync(async (req, res) => {
  const files = await File.find();

  res.status(200).render('feeds', {
    files,
  });
});

exports.forgot = (req, res) => {
  res.status(200).render('forgot');
};

exports.reset = (req, res) => {
  res.status(200).render('reset');
};

exports.base = (req, res) => {
  res.status(200).render('base');
};
