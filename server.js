const dotEnv = require('dotenv');
const mongoose = require('mongoose');

dotEnv.config({
  path: './config.env',
});
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('Connected to AJ file server database');
});

const port = process.env.PORT || 3128;

app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});
