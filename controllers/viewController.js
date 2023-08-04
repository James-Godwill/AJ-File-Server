//rendering pug template
const path = require('path');
const catchAsync = require('../utils/catchAsync');
const File = require('../models/fileModel');

exports.signup = (req, res) => {
  res.status(200).render('signup');
};

exports.getAllFiles = catchAsync(async (req, res) => {
  let files;

  const searchResult = req.params.title;

  console.log(searchResult);

  const regex = new RegExp(searchResult, 'i'); // i for case insensitive

  if (searchResult === 'default') {
    files = await File.find();
  } else if (searchResult !== 'null') {
    files = await File.find({
      title: { $regex: regex },
    });
  }

  console.log(files);

  res.status(200).render('feeds', {
    files: files,
  });
});

exports.preview = async (req, res) => {
  const filename = req.params.prevfile;

  res.status(200).render('preview', {
    path: filename,
  });
};

exports.upload = (req, res) => {
  res.status(200).render('uploader');
};

exports.forgot = (req, res) => {
  res.status(200).render('forgot');
};

exports.reset = (req, res) => {
  res.status(200).render('reset');
};

exports.base = (req, res) => {
  res.status(200).render('base');
};
