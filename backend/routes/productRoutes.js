// routes/productRoutes.js
// const { protect } = require('../middleware/auth');
import express from 'express';
const router = express.Router();
import {protect}  from '../middleware/auth.js';
import {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsExceptUser,
    getProductsOnlyForUser
} from '../controllers/productController.js';

router.route('/')
    .get(getAllProducts) // Temporarily remove authentication to see products
    // .get(protect, getProductsExceptUser)
    .post(protect, createProduct);

router.route('/seller')
    .get(protect, getProductsOnlyForUser);


router.route('/:id')
    .get(getProduct)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

export default router;