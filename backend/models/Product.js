// models/Product.js
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    category: {
        type: String,
        required: [true, 'Please select category'],
        enum: ['Electronics', 'Books', 'Clothing', 'Food', 'Sports', 'Others']
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        type: String,  // URLs to stored images
    }],
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'delivered', 'reserved'],
        default: 'available'
    },
    ratings: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    isDelivered: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// module.exports = mongoose.model('Product', productSchema);
export default mongoose.models.Product || mongoose.model('Product', productSchema);