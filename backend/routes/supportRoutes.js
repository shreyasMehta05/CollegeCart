// backend/routes/supportRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const { chat } = require('../controllers/supportController');
import express from 'express';
const router = express.Router();
import  {protect} from '../middleware/auth.js';
import { chat } from '../controllers/supportController.js';


router.post('/chat', protect, chat);

export default router;
