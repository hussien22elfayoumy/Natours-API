import jwt from 'jsonwebtoken';
import { promisify } from 'util';
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
    passwordChangedAt: req.body.passwordChangedAt,
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

export const protectRoute = catchErrorAsync(async (req, res, next) => {
  // 1) Get the token and check if it there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  // 2) token verfication

  if (!token)
    return next(
      new AppError('Unauthorize, Please login first to gain access', 401),
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)check if the user is still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(new AppError('The user is no longer exist,', 401));

  // 4) check if the user changed password after the token was issued
  if (freshUser.hasChangedPassword(decoded.iat))
    return next(
      new AppError('User recenty changed password, Please login again', 201),
    );

  //Grant access to protectd route
  req.user = freshUser;
  next();
});

export const authorize = (...roles) =>
  catchErrorAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You don't have permisson to make this action", 403),
      ); // 403 forbidded

    next();
  });

export const forgotPassword = catchErrorAsync(async (req, res, next) => {
  // Get user email and check if it there
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with that email.', 404));

  // Generate reandom token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false }); // save the changed in createReasetpasswordToken to the database

  console.log({ resetToken });

  // Send token to user email

  res.status(200).json({
    status: 'sucess',
  });
});
