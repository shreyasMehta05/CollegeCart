import express from 'express';
const router = express.Router();

import {protect}  from '../middleware/auth.js';

import {
    getProductsExceptUser,
    getParticularProduct
} from '../controllers/productController.js';

router.route('/').get(protect, getProductsExceptUser);

// router.route('/:id').get(protect, getParticularProduct);

export default router;