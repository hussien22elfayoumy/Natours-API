import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import catchErrorAsync from '../utils/catch-err-async.js';
import AppError from '../utils/app-error.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

export const singup = catchErrorAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // loggin the new  user in as soon as he signup

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchErrorAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password)
    return next(new AppError('Invalid Email or Password', 400));

  // 2)  check if user exist && check password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Invalid Email or Password', 401)); // 401 == unautorize

  const token = signToken(user._id);
  // 3) if Ok send token to the client
  res.status(200).json({
    status: 'sucess',
    token,
  });
});
