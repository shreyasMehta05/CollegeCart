// models/Order.js
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        hostel: {
            type: String,
            required: true
        },
        roomNumber: {
            type: String,
            required: true
        }
    },
    otp: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
      },
    otpUnhashed: {
        type: String,
        required: true
    },
    // paymentStatus: {
    //     type: String,
    //     enum: ['pending', 'completed', 'failed'],
    //     default: 'pending'
    // },
    // deliveryNotes: String,
    // cancelReason: String,
    isDelivered: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);