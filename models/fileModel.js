const mongoose = require('mongoose');
const validator = require('validator');

const fileSchema = mongoose.Schema({
  title: {
    type: 'string',
    required: [true, 'Please provide a title'],
  },
  description: {
    type: 'string',
    required: [true, 'Please provide a description'],
  },
  file: {
    type: 'string',
    required: [true, 'Please upload a file'],
  },
  totalDownloads: Number,
  totalMails: Number,
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
