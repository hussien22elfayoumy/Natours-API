import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],

    validate: {
      // will work only on save and create
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExp: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// using mongo middleware to hash password on pre save hook
userSchema.pre('save', async function (next) {
  // check if password is modified first to prevent un needed hasing
  if (!this.isModified('password')) return next();

  // hast the password
  this.password = await bcrypt.hash(this.password, 12);

  // remove the confirm password from database
  this.passwordConfirm = undefined;
  next();
});

// update the passwordChangedAt afte resetting it

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// query middleware return only user with active === true
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }); //points to the query

  next();
});

// check for the user password
// will be avilabel in all user documents instances
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if the user changed password after he logged in
userSchema.methods.hasChangedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < passwordTimestamp;
  }

  // false mean not changed
  return false;
};

// Generate reandom token for reset password

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExp = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('User', userSchema);

export default User;
