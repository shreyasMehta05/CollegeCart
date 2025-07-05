// routes/authRoutes.js
import express from 'express';
import { register, login, logout, getMe, casLoginCallback} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/cas/callback', casLoginCallback);


export default router;