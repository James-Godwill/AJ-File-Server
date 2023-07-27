const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) =>
  jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exit
  if (!email || !password) {
    console.log('Password is ', password);
    return next(new AppError('Please provide email and password', 400));
  }

  //Check if user exist and password is correct
  //+password was used to explicitly set password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);

  //send user jwt token
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check if token is available
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(`token: ${token}`);

  if (!token) {
    return next(new AppError('Please login to get access', 401));
  }

  //Validate token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Making it return a promise

  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to user no longer exits.', 401),
    );
  }

  //check if user changed password after issuing jwt
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password please login in again.',
        401,
      ),
    );
  }

  //Grant access to protected route
  //req.user is assinged into the middleware and passed to the next middleware
  req.user = currentUser;
  next();
});

//Roles is an array to restrict to multiple roles
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on email

  if (!req.body.email) {
    return next(new AppError('Provide password reset email', 401));
  }

  const user = await User.findOne({
    email: req.user.email,
  });

  if (!user) {
    return next(new AppError('No user found with such email address.', 401));
  }

  //Genereate random token
  const resetToken = user.resetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //Send it to the user's email address
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/aj/api/v1/users/resetpassword/${resetToken}`;

  console.log(resetURL);

  const message = `Forgot your password? submit a patch request with your new password and password confirm to:${resetURL}\nIf you did not forget your password,please ignore this message`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'PASSWORD RESET [VALID FOR 10 MIN]',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully to email address',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email,try again later', 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on reset token[Encrypt token in url and comapre with server token]
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //We check if the expiry date is in the future meaning it is yet to expire

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //implementation if token is expired
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  //if token is not expired,there is a user,set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  const token = signToken(user._id);

  //send user jwt token
  res.status(200).json({
    status: 'success',
    token,
  });

  //Update chagedPasswordAt property for the user
  //Log in user ,send JWT
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, passwordConfirm, password } = req.body;

  //Get user from the database
  if (!oldPassword || !passwordConfirm || !password) {
    return next(
      new AppError('Please all of the passwords should be provided.'),
    );
  }

  const user = await User.findOne({
    email: req.user.email,
  }).select('+password');

  console.log('password is ', user.password);

  const pbool = await user.correctPassword(oldPassword, user.password);

  console.log(pbool);

  //Check if password is correct
  if (!user || !(await user.correctPassword(oldPassword, user.password))) {
    return next(new AppError('Incorrect password provided', 401));
  }

  //Update the password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  //Log in user
  const token = signToken(user._id);

  //send user jwt token
  res.status(200).json({
    status: 'success',
    token,
  });
});
