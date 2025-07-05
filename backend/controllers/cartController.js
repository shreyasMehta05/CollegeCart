import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// Add product to cart
const addToCart = async (req, res) => {
    try {
        console.log('Received cart data:', req.body);
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            console.log('Product ID and quantity are required');
            return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
        }
        console.log('Fetching product:', productId);
        const product = await Product.findById(productId);
        console.log('Product found:', product);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        let cart = await Cart.findOne({ user: req.user._id });
        console.log('Cart found:', cart);
        if (!cart) {
            cart = new Cart({ user: req.user._id, cartItems: [] });
        }
        
        // Check if product is already in cart
        const productInCart = cart.cartItems.find(item => item.product.toString() === productId);

        if (productInCart) {
            return res.status(409).json({ success: false, message: 'Product already in cart' });
        }
        console.log('Adding product to cart:', productId);
        // Add new item to cart
        cart.cartItems.push({ product: productId, quantity });
        await cart.save();
        console.log('Product added to cart:', cart);
        res.status(200).json({ success: true, message: 'Product added to cart', cart });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const productIndex = cart.cartItems.findIndex(item => item.product.toString() === req.params.productId);

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        // Remove product from cart
        cart.cartItems.splice(productIndex, 1);
        await cart.save();

        res.status(200).json({ success: true, message: 'Product removed from cart', cart });

    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get user cart
const getCart = async (req, res) => {
    console.log('Fetching cart');
    try {
        console.log('User ID:', req.user._id);
        console.log('User:', req.user);
        const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
        console.log('Cart:', cart);
        if (!cart) {
            // this means the cart is empty
            // return res.status(404).json({ success: false, message: 'Cart not found' });
            return res.status(200).json({ success: true, cart: { cartItems: [] }, message: 'Cart fetched' });
        }
        console.log('Cart found:', cart);
        // first get the product details and make an array of products
        // then return the cart with the array of products
        cart.cartItems = cart.cartItems.map(item => {
            return {
                product: item.product,
                quantity: item.quantity
            };
        });
        console.log('Cart items:', cart.cartItems);
        res.status(200).json({ success: true, cart , message: 'Cart fetched' });


    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
    
};

const removeCart = async (req, res) => {
    try {
      // Assuming req.user is set by your authentication middleware
      const userId = req.user._id;
      
      // Find the cart for the current user
      const cart = await Cart.findOne({ user: userId });
      
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
      
      // Clear the cartItems array
      cart.cartItems = [];
      await cart.save();
      
      return res.status(200).json({ success: true, message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

export { addToCart, removeFromCart, getCart, removeCart };
