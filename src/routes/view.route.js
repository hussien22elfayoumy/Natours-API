import express from 'express';
import {
  getLoginFormView,
  getOverviewView,
  getTourView,
  getUserToursView,
  getUserView,
} from '../controllers/view.controller.js';
import { isLoggedIn, protectRoute } from '../controllers/auth.controller.js';
import { createBookingCheckout } from '../controllers/booking.controller.js';

const router = express.Router();

// Check if the user is logged in and pass it to next templates

router.get('/', isLoggedIn, getOverviewView);

router.get('/tours/:slug', isLoggedIn, getTourView);

router.get('/login', isLoggedIn, getLoginFormView);

router.get('/user', protectRoute, getUserView);

router.get(
  '/user-tours',
  protectRoute,
  createBookingCheckout,
  getUserToursView,
);

export default router;
