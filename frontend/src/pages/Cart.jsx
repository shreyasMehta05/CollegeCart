import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip
} from '@mui/material';
import { Delete, ShoppingCart, RemoveShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OtpDisplayDialog from './OtpDisplayDialog';

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
}));

const CartItemCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  alignItems: 'center',
  borderRadius: 12,
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4]
  }
}));

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpDialog, setOtpDialog] = useState({
    open: false,
    otp: null
  });

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const fetchedCart = response.data.cart;
      // also check if some products data is missing remove them
      fetchedCart.cartItems = fetchedCart.cartItems.filter(item => item?.product);
      // Expecting fetchedCart.cartItems to be an array; fallback to an empty array if not available.
      setCart(
        fetchedCart && Array.isArray(fetchedCart.cartItems)
          ? fetchedCart.cartItems
          : []
      );
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Error fetching cart items');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart((prevCart) =>
        prevCart.filter(item => item?.product?._id !== productId)
      );
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Error removing item');
    }
  };

  const removeCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Error clearing cart');
    }
  };

  const checkout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in to checkout.");
        return;
      }
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        {
          items: cart.map(item => ({
            product: item?.product?._id,
            quantity: item?.quantity
          })),
          totalAmount: cart.reduce(
            (total, item) => total + (item?.product?.price || 0) * (item?.quantity || 0),
            0
          ),
          deliveryAddress: {
            hostel: user.hostel,
            roomNumber: user.roomNumber  // Make sure this matches your user object fields
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // If order is created successfully, show a dialog with the OTP
      if (response.data.success) {
        setOtpDialog({ 
          open: true, 
          otp: response.data.otp 
        });
      } else {
        toast.error("Failed to create order.");
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Error creating order');
    }
  };

  const totalAmount = Array.isArray(cart)
    ? cart.reduce((total, item) => {
        const price = item?.product?.price || 0;
        const quantity = item?.quantity || 0;
        return total + price * quantity;
      }, 0)
    : 0;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'background.default'
      }}>
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      mt: 4, 
      mb: 4, 
      backgroundColor: 'background.paper', 
      borderRadius: 2,
      py: 3
    }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          textAlign: 'center',
          mb: 3
        }}
      >
        <ShoppingCart sx={{ mr: 2, verticalAlign: 'middle' }} />
        Shopping Cart
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            borderRadius: 2 
          }}
        >
          {error}
        </Alert>
      )}

      {cart.length === 0 ? (
        <StyledPaper sx={{ 
          p: 4, 
          textAlign: 'center', 
          backgroundColor: 'background.default' 
        }}>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => navigate('/products')}
            sx={{ 
              px: 3, 
              py: 1.5, 
              borderRadius: 2 
            }}
          >
            Continue Shopping
          </Button>
        </StyledPaper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {cart.map((item, index) => (
                  item?.product ? (
                    <Grid item xs={12} sm={6} md={4} key={item.product._id || index}>
                      <CartItemCard elevation={2}>
                        <CardMedia
                          component="img"
                          sx={{ 
                            width: 150, 
                            height: 150, 
                            objectFit: 'cover' 
                          }}
                          image={item.product.images?.[0] || '/placeholder-image.jpg'}
                          alt={item.product.name || 'Product Image'}
                        />
                        <CardContent sx={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start' 
                        }}>
                          <Box>
                            <Typography variant="h6">
                              {item.product.name}
                            </Typography>
                            <Typography color="primary" variant="h6">
                              ₹{item.product.price}
                            </Typography>
                            <Chip 
                              label={`Quantity: ${item.quantity}`} 
                              color="secondary" 
                              size="small" 
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <IconButton
                              color="error"
                              onClick={() => removeItem(item.product._id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </CartItemCard>
                    </Grid>
                  ) : (
                    // Render a fallback if the item or product data is missing
                    <Grid item xs={12} key={index}>
                      <Alert severity="error">
                        Product data is missing for one of the items.
                      </Alert>
                    </Grid>
                  )
                ))}
              </Grid>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  textAlign: 'center',
                  color: 'primary.main' 
                }}
              >
                Order Summary
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 2,
                px: 2
              }}>
                <Typography>Total Items:</Typography>
                <Chip 
                  label={cart.length} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 3,
                px: 2
              }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary">
                  ₹{totalAmount}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2 
              }}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={checkout}
                  disabled={cart.length === 0}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5 
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RemoveShoppingCart />}
                  color="error"
                  onClick={removeCart}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5 
                  }}
                >
                  Clear Cart
                </Button>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      )}
      <OtpDisplayDialog 
        open={otpDialog.open}
        onClose={() => setOtpDialog({ open: false, otp: null })}
        generatedOtp={otpDialog.otp}
        onVerify={() => {
          setOtpDialog({ open: false, otp: null });
          navigate('/orders');
        }}
      />
    </Container>
  );
};

export default Cart;
