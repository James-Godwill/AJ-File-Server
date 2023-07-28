const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const File = require('../models/fileModel');

let filename;

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    filename = `admin-${req.user.id}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: multerStorage,
});

exports.uploadFile = upload.single('file');

exports.createFile = catchAsync(async (req, res, next) => {
  const files = await File.create({
    title: req.body.title,
    description: req.body.description,
    file: filename,
    totalDownloads: 0,
    totalMails: 0,
  });

  console.log('req.file', req.file);
  console.log(req.body);
  res.status(200).json({
    success: true,
    files,
  });
});

exports.deleteFile = (req, res) => {};

exports.getFile = (req, res) => {};

exports.updateFile = (req, res) => {};

exports.getAllFiles = catchAsync(async (req, res) => {
  const files = await File.find();

  res.status(200).json({
    files: files,
  });
});
