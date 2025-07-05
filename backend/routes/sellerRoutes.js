// Backend APIs (order.routes.js)
// In the backend/routes/orderRoutes.js file, add the following route handlers:
import express from 'express';
const router = express.Router();
import Order from '../models/Order';
import auth from '../middleware/auth';
import crypto from 'crypto';

// Get all pending deliveries for seller
router.get('/pending-deliveries', auth, async (req, res) => {
    try {
        const orders = await Order.find({ 
            sellerId: req.user.id,
            status: 'pending'
        })
        .populate('buyerId', 'name email')
        .populate('productId', 'name price');
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify OTP and complete delivery
router.post('/complete-delivery/:orderId', auth, async (req, res) => {
    try {
        const { otp } = req.body;
        const order = await Order.findOne({
            _id: req.params.orderId,
            sellerId: req.user.id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        order.status = 'completed';
        order.deliveryDate = new Date();
        await order.save();

        res.json({ message: 'Delivery completed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});