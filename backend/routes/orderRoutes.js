// routes/orderRoutes.js
// const express = require('express');
import express from 'express';
const router = express.Router();
import {protect} from '../middleware/auth.js';
import {
    createOrder,
    verifyOrder,
    getBuyerOrders,
    getSellerOrders,
    generateNewOTP,
    getOrderStats,
    getPendingDeliveries,
    completeDelivery,
    getDeliveryHistory
} from '../controllers/orderController.js';
import Order from '../models/Order.js';

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyOrder);
router.get('/buyer', protect, getBuyerOrders);
router.get('/seller', protect, getSellerOrders);
router.post('/generate-otp', protect, generateNewOTP);
router.get('/stats', protect, getOrderStats);
router.get('/pending-deliveries', protect, getPendingDeliveries);
router.post('/complete-delivery/', protect, completeDelivery);
router.get('/delivery-history', protect, getDeliveryHistory);

export default router;