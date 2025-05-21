import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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

const User = mongoose.model('User', userSchema);

export default User;
