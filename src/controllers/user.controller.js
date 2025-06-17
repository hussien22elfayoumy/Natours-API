import multer from 'multer';
import sharp from 'sharp';
import User from '../models/user.model.js';
import catchErrorAsync from '../utils/catch-err-async.js';
import { deleteOne, getMany, getOne, updateOne } from './handler-factory.js';
import AppError from '../utils/app-error.js';

/* const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
}); */

// store image in memory as a buffer to do some work on it
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Please ppload only images', 404), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

export const uploadUserPhoto = upload.single('photo');

// logged in user actions
export const getCurrentUser = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};

export const updateAccount = catchErrorAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      photo: req?.file?.filename,
    },
    {
      new: true,
      runValidators: true,
    },
  );

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
export const getAllUsers = getMany(User);

export const getUser = getOne(User);

export const deleteUser = deleteOne(User);

export const updateUser = updateOne(User);
