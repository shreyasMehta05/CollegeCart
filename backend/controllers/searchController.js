// controllers/searchController.js
// const Product = require('../models/Product');
import Product from '../models/Product.js';

const searchProducts = async (req, res) => {
    try {
        const { 
            search, 
            category, 
            minPrice, 
            maxPrice, 
            sortBy,
            rating 
        } = req.query;

        let query = {};

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = { $in: category.split(',') };
        }

        // Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Rating filter
        if (rating) {
            query['ratings.average'] = { $gte: Number(rating) };
        }

        // Create sort object
        let sort = {};
        if (sortBy) {
            const [field, order] = sortBy.split(':');
            sort[field] = order === 'desc' ? -1 : 1;
        }

        const products = await Product.find(query)
            .sort(sort)
            .populate('sellerId', 'firstName lastName ratings');

        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { searchProducts };