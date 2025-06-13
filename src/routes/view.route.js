import express from 'express';
import {
  getLoginFormView,
  getOverviewView,
  getTourView,
} from '../controllers/view.controller.js';
import { isLoggedIn } from '../controllers/auth.controller.js';

const router = express.Router();

// Check if the user is logged in and pass it to next templates
router.use(isLoggedIn);

router.get('/', getOverviewView);

router.get('/tours/:slug', getTourView);

router.get('/login', getLoginFormView);

export default router;
