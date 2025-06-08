import express from 'express';
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  setTourUserIds,
  updateReview,
} from '../controllers/review.controller.js';
import { authorize, protectRoute } from '../controllers/auth.controller.js';

const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router
  .route('/')
  .get(getReviews)
  .post(authorize('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(authorize('user', 'admin'), updateReview)
  .delete(authorize('user', 'admin'), deleteReview);

export default router;
