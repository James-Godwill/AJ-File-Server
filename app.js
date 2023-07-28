/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const fileRouter = require('./routes/fileRoutes');
const userRouter = require('./routes/userRoutes');

//Set security http headers
app.use(helmet());

//Global middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an hour!',
});

//To improve security by limiting requests from same IP
app.use('/aj', limiter);

//body parse reading data from the body
app.use(
  express.json({
    limit: '10kb',
  }),
);
//Data sanitization against nosql query injection
//Sanitizes data and removes any dollar signs for nosql injection attacks
app.use(mongoSanitize());

//Data sanitization against XSS[when fields use html tags with a bit of javascript]
app.use(xss());

//serving static files
app.use(express.static('./public'));

//prevent parameter polution
// app.use(hpp({
//   whitelist: [

//   ]
// }));

//Data has to whitelisted when searching for files on the server

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
app.use('/aj/api/v1/files', fileRouter);

app.use('/aj/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
