import express from 'express';
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from '../controllers/review.controller.js';
import { authorize, protectRoute } from '../controllers/auth.controller.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getReviews)
  .post(protectRoute, authorize('user'), createReview);

router.route('/:id').patch(updateReview).delete(deleteReview);

export default router;
