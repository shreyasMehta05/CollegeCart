// routes/userRoutes.js
import express from 'express';
const router = express.Router();
import {protect}  from '../middleware/auth.js';
import {
    updateProfile,
    getProfile,
    getSellerProfile,
    changePassword
} from '../controllers/userController.js';


router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/changePassword',protect, changePassword);
router.get('/seller/:sellerId', getSellerProfile);

export default router;