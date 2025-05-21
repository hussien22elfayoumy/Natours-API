import User from '../models/user.model.js';
import catchErrorAsync from '../utils/catch-err-async.js';

export const singup = catchErrorAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser,
    },
  });
});

export const singin = catchErrorAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
});
