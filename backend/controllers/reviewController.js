// controllers/reviewController.js
// const Review = require('../models/Review');
// const User = require('../models/User');
// const Product = require('../models/Product');
import Review from '../models/Review.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const createReview = async (req, res) => {
    try {
        const { sellerId, productId, rating, comment } = req.body;

        // Check if user has already reviewed
        const existingReview = await Review.findOne({
            user: req.user._id,
            seller: sellerId,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this seller/product' });
        }

        const review = await Review.create({
            user: req.user._id,
            seller: sellerId,
            product: productId,
            rating,
            comment
        });

        // Update seller's average rating
        const sellerReviews = await Review.find({ seller: sellerId });
        const averageRating = sellerReviews.reduce((acc, item) => acc + item.rating, 0) / sellerReviews.length;

        await User.findByIdAndUpdate(sellerId, {
            'ratings.average': averageRating,
            'ratings.count': sellerReviews.length
        });

        // Update product's average rating
        const productReviews = await Review.find({ product: productId });
        const productAverageRating = productReviews.reduce((acc, item) => acc + item.rating, 0) / productReviews.length;

        await Product.findByIdAndUpdate(productId, {
            'ratings.average': productAverageRating,
            'ratings.count': productReviews.length
        });

        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSellerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ seller: req.params.sellerId })
            .populate('user', 'firstName lastName')
            .populate('product', 'name');
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'firstName lastName')
            .populate('seller', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createReview, getSellerReviews, getProductReviews };