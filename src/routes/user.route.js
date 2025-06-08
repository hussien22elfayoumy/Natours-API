import express from 'express';
import {
  deactivateAccount,
  deleteUser,
  getAllUsers,
  updateAccount,
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
router.patch('/update-user', protectRoute, updateAccount);
router.delete('/deactivate-user', protectRoute, deactivateAccount);

router.route('/').get(getAllUsers);
router.route('/:id').delete(deleteUser);

export default router;
