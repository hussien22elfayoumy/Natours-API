import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';
import User from '../models/user.model.js';
import catchErrorAsync from '../utils/catch-err-async.js';
import AppError from '../utils/app-error.js';
import sendEmail from '../utils/send-email.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

const createSendToken = (user, statuscode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.scure = true;

  res.cookie('natours-jwt', token, cookieOptions);

  res.status(statuscode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const singup = catchErrorAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // loggin the new  user in as soon as he signup

  createSendToken(newUser, 201, res);
});

export const login = catchErrorAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const { email, password } = req.body;
  console.log(typeof email);

  // 1) check if email and password exist
  if (!email || !password || typeof email !== 'string')
    return next(new AppError('Invalid Email or Password', 400));

  // 2)  check if user exist && check password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Invalid Email or Password', 401)); // 401 == unautorize

  // 3) if Ok send token to the client
  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie('natours-jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

export const protectRoute = catchErrorAsync(async (req, res, next) => {
  // 1) Get the token and check if it there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies['natours-jwt']) {
    token = req.cookies['natours-jwt'];
  }

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

// Only for rendered pages , no erros.
export const isLoggedIn = async (req, res, next) => {
  // 1) Get the token and check if it there
  try {
    const token = req.cookies['natours-jwt'];
    if (token) {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET,
      );

      //2) check if the user is still exist
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) return next();

      // 3) check if the user changed password after the token was issued
      if (freshUser.hasChangedPassword(decoded.iat)) return next();

      // there is a logged in user pass it to the templates
      res.locals.loggedInUser = freshUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

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

  // Send token to user email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Follow this link to reset password (valid for 10mins)',
      text: resetURL,
    });

    res.status(200).json({
      status: 'sucess',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExp = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email, Try again later',
        500,
      ),
    );
  }
});

export const resetPassword = catchErrorAsync(async (req, res, next) => {
  // 1) get user based on token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExp: { $gt: Date.now() },
  });

  // 2) if token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Invalid token or has Expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExp = undefined;

  await user.save();
  // 3) update changedpasswordAt property for the user done in middleware

  // 4) log the user in and send jwt to the client
  createSendToken(user, 200, res);
});

export const updatePassword = catchErrorAsync(async (req, res, next) => {
  // 1) Get the user from the database based on token
  const user = await User.findById(req.user._id).select('+password');

  // 2) Check if the current password is correct
  const isPasswordCorrect = await user.checkPassword(
    req.body.currentPassword,
    user.password,
  );

  if (!isPasswordCorrect)
    return next(new AppError('The current password is not correct', 401));

  // 3) if so, udate the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) log the user in , send jwt
  createSendToken(user, 200, res);
});
