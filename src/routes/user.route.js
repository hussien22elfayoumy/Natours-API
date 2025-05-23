import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/user.controller.js';
import {
  forgotPassword,
  login,
  protectRoute,
  resetPassword,
  singup,
  updatePassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', singup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-password', protectRoute, updatePassword);
router.patch('/update-user', protectRoute, updateUser);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
