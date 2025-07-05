// routes/reviewRoutes.js


import express from 'express';
const router = express.Router();
import {protect} from '../middleware/auth.js';
import { createReview, getSellerReviews, getProductReviews } from '../controllers/reviewController.js';



router.post('/', protect, createReview);
router.get('/seller/:sellerId', getSellerReviews);
router.get('/product/:productId', getProductReviews);

export default router;