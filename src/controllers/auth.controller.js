import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import catchErrorAsync from '../utils/catch-err-async.js';

export const singup = catchErrorAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // loggin the new  user in as soon as he signup

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user: newUser,
    },
  });
});

export const singin = catchErrorAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
});
