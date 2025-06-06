import express from 'express';
import { createReview, getReviews } from '../controllers/review.controller.js';
import { authorize, protectRoute } from '../controllers/auth.controller.js';

const router = express.Router();

router
  .route('/')
  .get(getReviews)
  .post(protectRoute, authorize('user'), createReview);

export default router;
