const mongoose = require('mongoose');
const validator = require('validator');

const fileSchema = mongoose.Schema({
  title: {
    type: 'string',
    required: [true, 'Please provide a title'],
    unique: true,
  },
  description: {
    type: 'string',
    required: [true, 'Please provide a description'],
  },
  file: {
    type: 'string',
    required: [true, 'Please upload a file'],
  },
  fileType: {
    type: 'string',
  },
  createdAt: String,
  fileSize: String,
  totalDownloads: Number,
  totalMails: Number,
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
