const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: 'string',
    required: [true, ' Please tell us your name'],
  },
  email: {
    type: 'string',
    required: [true, ' Please provide your email address'],
    unique: true,
    toLowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: String,
  role: {
    type: 'string',
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: 'string',
    required: [true, ' Please provide a password'],
    minlenght: 8,
    select: false,
  },
  passwordConfirm: {
    type: 'string',
    required: [true, ' Please confirm your password'],
    validate: {
      //This only works on save and onCreate
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //Only run fuction if password is modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Will prevent password confirm from being defined
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  //False means password not changed
  return false;
};

userSchema.methods.resetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(
    `Password reset token is: ${this.passwordResetToken} and reset token is: ${resetToken}`,
  );

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
