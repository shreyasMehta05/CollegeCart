// controllers/orderController.js

// Import the necessary modules and models
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import crypto from 'crypto';
import Cart from '../models/Cart.js';
import { StatusCodes } from 'http-status-codes';
import { stat } from 'fs';


/**
 * Create a new order.
 * 
 * This endpoint performs several key tasks:
 * 1. Validates that every product in the order exists.
 * 2. Calculates the total amount based on the product price and requested quantity.
 * 3. Generates a random 6-digit OTP for order verification.
 * 4. Hashes the OTP using SHA-256 to store it securely in the database.
 * 5. Creates the order with a 24-hour OTP expiry period.
 * 6. Returns the order along with the plain OTP in the response.
 * 
 * Note: In a production system, the plain OTP should be sent to the user
 * via a secure channel (e.g., SMS or email) rather than returning it in the response.
 */
const createOrder = async (req, res) => {
    console.log("Hi");
    try {
      // Extract the items from the request body.
      const { items } = req.body;
      console.log("Request body:", req.body);
  
      // Retrieve the delivery address from the authenticated user.
      // We're expecting that the user object contains 'hostel' and 'room' fields.
      console.log("User:", req.user);
      const deliveryAddress = {
        hostel: req.user.hostel,
        roomNumber: req.user.room
      };
      if (!deliveryAddress || !deliveryAddress.hostel || !deliveryAddress.roomNumber) {
        return res.status(400).json({ message: "User delivery address is incomplete. Please update your profile." });
      }
  
      // Initialize total amount for the order.
      let totalAmount = 0;
      // Create an array to hold processed items with all necessary fields.
      const processedItems = [];
  
      // Loop through each item to:
      //  a) Validate that the item contains both product ID and quantity.
      //  b) Validate that the product exists.
      //  c) Calculate the total order amount.
      //  d) Populate the required fields (price and seller) for each item.
      for (const item of items) {
        // Validate that each item has a product ID and quantity.
        if (!item.product || !item.quantity) {
          return res.status(400).json({ message: "Each item must include a product ID and quantity." });
        }
  
        // Retrieve product details using the product ID.
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.product} not found` });
        }
  
        // Add to the total amount (price * quantity).
        totalAmount += product.price * item.quantity;
  
        // Push the complete item into the processedItems array.
        processedItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,           // Required: the price of the product.
          seller: product.sellerId        // Required: the seller information from the product.
        });
      }
  
      console.log("Calculated total amount:", totalAmount);
  
      // Generate a random 6-digit OTP (as a string).
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Hash the OTP using SHA-256 to store securely in the database.
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
      // Generate a unique transaction ID (16-byte hex string).
      const transactionId = crypto.randomBytes(16).toString('hex');
  
      // Create the order using the processed items, total amount, delivery address,
      // hashed OTP, and the generated transaction ID.
      const order = await Order.create({
        buyer: req.user._id,
        items: processedItems, // Use the processed items with price and seller.
        totalAmount,
        deliveryAddress,       // Contains hostel and roomNumber.
        otp: hashedOtp,
        otpUnhashed: otp,      // For demonstration only; remove in production.
        transactionId        // The generated transaction id.
      });
  
      console.log("Order created successfully with total:", totalAmount);
      console.log(order);
      // clear the cart after creating the order
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart){
        cart.cartItems = [];
        await cart.save();
      }
      console.log("Cart cleared");

      // Respond with a 201 status code and include the order, OTP, and transactionId.
      // In a real application, do not return the plain OTP in the response.
      res.status(201).json({ success: true, order, otp, transactionId });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };
  

/**
 * Verify an order using the provided OTP.
 * 
 * This endpoint checks:
 * 1. That the order exists.
 * 2. That the provided OTP, once hashed, matches the stored OTP.
 * 3. That the OTP has not expired.
 * 
 * If all checks pass, the order status is updated to 'delivered'.
 */
const verifyOrder = async (req, res) => {
    try {
        const { orderId, otp } = req.body;
        // Hash the provided OTP for comparison.
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Retrieve the order by ID.
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Compare the hashed OTP values.
        if (order.otp !== hashedOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if the OTP has expired.
        if (Date.now() > order.otpExpiry) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // If verification is successful, update the order status to 'delivered'.
        order.status = 'delivered';
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Get all orders for the buyer.
 * 
 * This endpoint fetches all orders where the authenticated user is the buyer.
 * It populates the order items with product details and basic seller information.
 */
const getBuyerOrders = async (req, res) => {
    console.log("Getting buyer orders");
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('items.product')
            .populate('items.seller', 'firstName lastName'); // Populate only firstName and lastName of seller
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Get all orders for the seller.
 * 
 * This endpoint fetches all orders where the authenticated user is the seller.
 * It populates the buyer information and the details of the products ordered.
 */
const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'items.seller': req.user._id })
            .populate('buyer', 'firstName lastName')
            .populate('items.product');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const generateNewOTP = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Generate new 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Update order with new OTP
        order.otp = hashedOtp;
        order.otpUnhashed = otp;
        order.otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        
        await order.save();

        res.status(200).json({ 
            success: true, 
            message: 'New OTP generated successfully',
            order 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// this is specific ti the user who logged in
const getOrderStats = async (req, res) => {
    try {
        // totalProducts: 0,
        // totalSales: 0,
        // totalRevenue: 0
        const totalProducts = await Product.find({ sellerId: req.user._id }).countDocuments();
        const totalSales = await Order.find({ 'items.seller': req.user._id }).countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { 'items.seller': req.user._id, status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        res.status(200).json({
            success: true,
            totalProducts,
            totalSales,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};





// Get all pending deliveries for a seller
const getPendingDeliveries = async (req, res) => {
    try {
        const sellerId = req.user._id;
        console.log("Seller ID:", sellerId);
        console.log("Finding orders");
        
        const pendingDeliveries = await Order.find({
            'items.seller': sellerId,
            status: 'pending',
            // paymentStatus: 'completed'
        })
        .populate('buyer', 'name email phoneNumber')
        .populate('items.product', 'name price images')
        .sort('-createdAt');
        console.log("Pending Deliveries:", pendingDeliveries);
        // Format the response to group by order
        
        const formattedDeliveries = pendingDeliveries.map(order => ({
            orderId: order._id,
            buyer: order.buyer,
            deliveryAddress: order.deliveryAddress,
            orderDate: order.createdAt,
            items: order.items.filter(item => 
                item.seller.toString() === sellerId.toString()
            ),
            // deliveryNotes: order.deliveryNotes,
            transactionId: order.transactionId
            // console.log("Order Items:", order.items);
        }));
        console.log("Formatted Deliveries:", formattedDeliveries);
        res.status(StatusCodes.OK).json({
            success: true,
            count: formattedDeliveries.length,
            deliveries: formattedDeliveries
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch pending deliveries',
            error: error.message
        });
    }
};

// Verify OTP and complete delivery
const completeDelivery = async (req, res) => {
    try {
        console.log("Completing delivery");
        const { orderId, otp } = req.body;
        const sellerId = req.user._id;
        const order = await Order.findOne({
            _id: orderId,
            'items.seller': sellerId,
            status: 'pending'
        });
        console.log("Order:", order);

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify OTP
        if (order.otpUnhashed !== otp) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid OTP'
            });
        }
        // verify otp with hashed otp
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        if (order.otp !== hashedOtp) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid OTP hash'
            });
        }

        // all the items in the order are delivered so mark the boolen as true
        order.items = order.items.map(item => {
            if (item.seller.toString() === sellerId.toString()) {
                return { ...item, isDelivered: true };
            }
            return item;
        });
        // Mark only this seller's items as delivered
        const sellerItems = order.items.filter(
            item => item.seller.toString() === sellerId.toString()
        );

        if (sellerItems.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'No items found for this seller in the order'
            });
        }

        // Check if this is the last seller to deliver
        const otherUndeliveredItems = order.items.filter(
            item => item.seller.toString() !== sellerId.toString()
        );

        // If all items are delivered, mark the entire order as delivered
        if (otherUndeliveredItems.length === 0) {
            order.status = 'delivered';
        }

        // Mark the seller's product in this order as delivered
        order.items = order.items.map(item => {
            if (item.seller.toString() === sellerId.toString()) {
                return { ...item, isDelivered: true, status: 'sold' };
            }
            return item;
        });
        order.items.forEach(item => {
            if (item.seller.toString() === sellerId.toString()) {
                item.isDelivered = true;
                item.status = 'sold';

                // Update the actual product in the database
                Product.findByIdAndUpdate(item.product, {
                    status: 'delivered',
                    isDelivered: true
                }, { new: true })
                .then(updatedProduct => console.log(`Product ${updatedProduct._id} marked as delivered`))
                .catch(err => console.error('Error updating product:', err));
            }
        });

        await order.save();

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Delivery completed successfully'
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to complete delivery',
            error: error.message
        });
    }
};

// Get delivery history for a seller
const getDeliveryHistory = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { status, startDate, endDate } = req.query;

        let query = {
            'items.seller': sellerId
        };

        if (status) {
            query.status = status;
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const deliveries = await Order.find(query)
            .populate('buyer', 'name email phoneNumber')
            .populate('items.product', 'name price images')
            .sort('-createdAt');

        const formattedDeliveries = deliveries.map(order => ({
            orderId: order._id,
            buyer: order.buyer,
            deliveryAddress: order.deliveryAddress,
            orderDate: order.createdAt,
            deliveryDate: order.updatedAt,
            status: order.status,
            items: order.items.filter(item => 
                item.seller.toString() === sellerId.toString()
            ),
            transactionId: order.transactionId
        }));

        res.status(StatusCodes.OK).json({
            success: true,
            count: formattedDeliveries.length,
            deliveries: formattedDeliveries
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch delivery history',
            error: error.message
        });
    }
};

// Export the controller functions for use in routes.
export { createOrder, verifyOrder, getBuyerOrders, getSellerOrders, generateNewOTP , getOrderStats, getPendingDeliveries, completeDelivery, getDeliveryHistory };
