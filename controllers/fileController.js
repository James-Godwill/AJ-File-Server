/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const File = require('../models/fileModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const sendEmail = require('../utils/email');
const catchAsync = require('../utils/catchAsync');

let filename;

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    console.log('request', req);
    const ext = file.mimetype.split('/')[1];
    const originalname = file.originalname.replace(/\s/g, '').split('.')[0];

    filename = `${originalname}-${req.user.id}.${ext}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage: multerStorage,
});

exports.uploadFile = upload.single('file');

exports.createFile = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  console.log(req.file);

  const fileType = req.file.mimetype.split('/')[1];

  const originalname = req.file.originalname.replace(/\s/g, '').split('.')[0];

  const fileName = `${originalname}-${req.user.id}.${fileType}`;

  const fileSize = formatBytes(req.file.size);
  // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  const d = new Date();
  const monthName = month[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  const fullDay = `${monthName}/${day}/${year}`;

  const files = await File.create({
    title: req.body.title,
    description: req.body.description,
    file: fileName,
    totalDownloads: 0,
    totalMails: 0,
    createdAt: fullDay,
    fileType: fileType,
    fileSize: fileSize,
  });

  console.log('req.file', req.file);
  res.status(200).json({
    status: 'success',
    files,
  });
});

exports.downloadFile = catchAsync(async (req, res, next) => {
  const folderPath = './public/uploads';

  try {
    const nameOfFile = req.params.filename;

    res.download(`${folderPath}/${nameOfFile}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const file = await File.findOne({
      file: nameOfFile,
    });

    file.totalDownloads += 1;

    await file.save();
  } catch (err) {
    return next(new AppError('Error Downloading file'));
  }
});

exports.sendFileAsMail = catchAsync(async (req, res, next) => {
  try {
    const eName = req.params.email;

    const emessage = 'Attached is the the file you requested';

    await sendEmail({
      email: 'jamesgodwillarkoh@gmail.com',
      subject: 'FILE REQUEST SUBMISSION',
      message: emessage,
      filename: eName,
    });

    const file = await File.findOne({
      file: eName,
    });

    file.totalMails += 1;

    await file.save();

    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully to email address',
    });
  } catch (err) {
    return next(
      new AppError('There was an error sending email,try again later', 500),
    );
  }
});

exports.searchFile = catchAsync(async (req, res, next) => {
  const searchResult = req.params.name;

  const regex = new RegExp(searchResult, 'i'); // i for case insensitive

  const files = await File.find({
    title: { $regex: regex },
  });

  console.log('files is', files);

  if (files.length === 0) {
    res.status(200).json({
      success: true,
      files,
      message: 'No files found',
    });
  } else {
    res.status(200).json({
      status: 'success',
      files,
    });
  }
});

exports.updateFile = (req, res) => {};

exports.getAllFiles = catchAsync(async (req, res) => {
  const files = await File.find();

  res.status(200).json({
    files: files,
  });
});
