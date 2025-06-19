import express from 'express';
import { protectRoute } from '../controllers/auth.controller.js';
import { getCheckoutSession } from '../controllers/booking.controller.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protectRoute, getCheckoutSession);

export default router;
