import User from '../models/user.model.js';
import catchErrorAsync from '../utils/catch-err-async.js';
import { deleteOne } from './handler-factory.js';

// logged in user actions
export const updateAccount = catchErrorAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  console.log(user);

  res.status(200).json({
    status: 'sucess',
    data: {
      user,
    },
  });
});

export const deactivateAccount = catchErrorAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Admin actions
export const getAllUsers = catchErrorAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'sucess',
    data: {
      users,
    },
  });
});

export const deleteUser = deleteOne(User);
