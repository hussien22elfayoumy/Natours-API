import express from 'express';
import {
  deactivateAccount,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUser,
  updateAccount,
  updateUser,
} from '../controllers/user.controller.js';
import {
  authorize,
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

// Protect all next routes after this middleware
router.use(protectRoute);

router.get('/current', getCurrentUser);
router.patch('/update-password', updatePassword);
router.patch('/update-user', updateAccount);
router.delete('/deactivate-user', deactivateAccount);

router.use(authorize('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
