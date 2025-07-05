// controllers/productController.js
// const Product = require('../models/Product');
import Product from '../models/Product.js';
import User from '../models/User.js';

const createProduct = async (req, res) => {
    try {
        // Log request body (use only in development, avoid in production)
        console.log('Received product data:', req.body);
        console.log('User ID:', req.user._id);

        // Destructure fields from request body
        const { name, price, description, category, condition, images, ratings } = req.body;

        // Validate required fields
        if (!name || !price || !description || !category || !condition || !images || !ratings) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Check if price is valid (positive number)
        if (price <= 0) {
            return res.status(400).json({ message: 'Price must be greater than zero' });
        }

        // Create the product in the database
        const product = await Product.create({
            name,
            price,
            description,
            category,
            condition,
            images,
            ratings,
            sellerId: req.user._id // Assuming user ID is attached to the request
        });

        // Send success response with the created product
        res.status(201).json({ success: true, product });

        // Optionally log product details (avoid logging in production)
        console.log('Product created:', product);
    } catch (error) {
        // Return a generic error message and log the error
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = { $in: category.split(',') };
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).populate('sellerId', 'firstName lastName');
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// get a particular product given its id
const getProduct = async (req, res) => {
    console.log("Fetching product");
    // console.log(req.params);
    const id = req.params.id;
    try {
        const product = await Product.findById(req.params.id).populate('sellerId');
        console.log("Product fetched");
        console.log(product);

        if (!product) {
            console.log("Product not found");
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log("Product found");
        console.log("started searching for seller details");
        const seller = await User.findById(product.sellerId);
        console.log("seller details found");
        console.log(seller);

        res.status(200).json({ success: true, product,seller });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: 'No update data provided' });
        }

        // Find product and check if it exists
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check authorization
        console.log("Product seller ID:", product.sellerId);
        console.log("User ID:", req.user._id);
        // why this condition is required?
        // because we don't want to allow other users to update the product
        if(product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }
        

        // Validate the update data
        const updateData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            condition: req.body.condition,
            images: req.body.images
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { 
                new: true, 
                runValidators: true 
            }
        );

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error('Update product error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        // Find product and check if it exists
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check authorization
        if (product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        // Delete the product
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId })
            .populate('sellerId', 'firstName lastName ratings');
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ 'ratings.average': { $gte: 4 } })
            .sort({ 'ratings.average': -1 })
            .limit(10)
            .populate('sellerId', 'firstName lastName ratings');
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProductsOnlyForUser = async (req, res) => {

    try {
        const userId = req.user._id; // Logged-in user's ID
        const { search, category, minPrice, maxPrice, rating } = req.query;
        
        // Build the query to fetch products
        const filter = {
            sellerId: userId, // Only products from the logged-in user
        };

        if (search) {
            filter.name = { $regex: search, $options: 'i' }; // Search for product name
        }
        if (category) {
            filter.category = { $in: category.split(',') }; // Filter by categories
        }
        if (minPrice && maxPrice) {
            filter.price = { $gte: minPrice, $lte: maxPrice }; // Filter by price range
        }
        if (rating) {
            filter['ratings.average'] = { $gte: rating }; // Filter by minimum rating
        }

        const products = await Product
            .find(filter)
            .populate('sellerId', 'firstName lastName ratings');
        res.status(200).json({ products });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// this function helps to get all products except the logged in user's products
const getProductsExceptUser = async (req, res) => {
    try {
        const userId = req.user._id; // Logged-in user's ID
        const { search, category, minPrice, maxPrice, rating, sort } = req.query;

        // Build the query to fetch products
        const filter = {
            sellerId: { $ne: userId }, // Exclude products from the logged-in user
            status: { $ne: 'delivered' } // Exclude delivered products
        };

        if (search) {
            filter.name = { $regex: search, $options: 'i' }; // Search for product name
        }
        if (category) {
            filter.category = { $in: category.split(',') }; // Filter by categories
        }
        if (minPrice && maxPrice) {
            filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) }; // Filter by price range
        }
        if (rating) {
            filter['ratings.average'] = { $gte: Number(rating) }; // Filter by minimum rating
        }

        // Create a sort object
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case 'priceAsc':
                    sortOption = { price: 1 };
                    break;
                case 'priceDesc':
                    sortOption = { price: -1 };
                    break;
                case 'rating':
                    sortOption = { 'ratings.average': -1 };
                    break;
                case 'newest':
                default:
                    sortOption = { createdAt: -1 };
                    break;
            }
        }

        const products = await Product.find(filter)
            .sort(sortOption)
            .populate('sellerId', 'firstName lastName');
            
        res.status(200).json({ success: true, products }); // Match the format from getAllProducts
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// get particular product
const getParticularProduct = async (req, res) => {
    console.log("",req);
    console.log("hit");
    console.log(req.params.id);
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct , getSellerProducts, getFeaturedProducts, getProductsExceptUser, getParticularProduct, getProductsOnlyForUser};