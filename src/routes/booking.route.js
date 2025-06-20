import express from 'express';
import { authorize, protectRoute } from '../controllers/auth.controller.js';
import {
  createBooking,
  deleteBooking,
  getBooking,
  getBookings,
  getCheckoutSession,
  updateBooking,
} from '../controllers/booking.controller.js';

const router = express.Router();

router.use(protectRoute);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(authorize('admin', 'lead-guide'));

router.route('/').get(getBookings).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
