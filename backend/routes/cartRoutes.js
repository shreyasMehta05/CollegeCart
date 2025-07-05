// routes/cartRoutes.js

import express from 'express';
const router = express.Router();
import {protect}  from '../middleware/auth.js';
import {
    addToCart,
    removeFromCart,
    getCart,
    removeCart
} from '../controllers/cartController.js';


router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/remove/:productId', protect, removeFromCart);
router.delete('/', protect, removeCart);
export default router;