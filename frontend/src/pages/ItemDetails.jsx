import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Paper,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { authUtils } from '@/utils/auth';

// Styled components
const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 400,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: theme.spacing(2)
}));

const DetailsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1]
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2)
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: status === 'Available' 
    ? theme.palette.success.light 
    : theme.palette.error.light,
  color: theme.palette.common.white
}));

const SellerCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
}));

const BuyButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  width: '100%',
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[5]
  }
}));

const ItemDetails = () => {
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: '', severity: '' });
  const { productId } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProduct(response.data.product);
        setSeller(response.data.seller);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setFeedback({ 
          message: error.response?.data?.message || 'Error fetching product details', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        mt: 8,
        p: 4,
        backgroundColor: 'error.light',
        borderRadius: 1
      }}>
        <Typography variant="h5" color="error.dark">
          Product not found
        </Typography>
      </Box>
    );
  }

  const user = authUtils.getUser();
  if (user) {
    console.log('User:', user.id);
    console.log('Seller:', product.sellerId._id);
  }
  const isOwner = user && product.sellerId._id === user.id;

  // Function to handle adding the product to the cart.
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFeedback({ message: 'User not authenticated', severity: 'error' });
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId: product._id, quantity: 1 },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Cart updated:', response.data);
      setFeedback({ message: 'Item added to cart successfully!', severity: 'success' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Error adding to cart:', errorMsg);
      setFeedback({ message: errorMsg, severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: '0 auto' }}>
      {feedback.message && (
        <Alert 
          severity={feedback.severity} 
          onClose={() => setFeedback({ message: '', severity: '' })}
          sx={{ mb: 2 }}
        >
          {feedback.message}
        </Alert>
      )}
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <ProductCard>
            <ProductImage
              component="img"
              image={product.images?.[0] || 'https://via.placeholder.com/400'}
              alt={product.name}
            />
          </ProductCard>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <DetailsSection>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>
            
            <StatusChip 
              label={product.status} 
              status={product.status}
            />

            <PriceTag>₹{product.price.toLocaleString()}</PriceTag>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {product.category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Condition
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {product.condition}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Seller Information */}
            {seller && user && (
              <SellerCard elevation={0}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Seller Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {seller.firstName} {seller.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Contact
                    </Typography>
                    <Typography variant="body1">
                      {seller.contactNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {seller.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {seller.hostel}, Room {seller.room}
                    </Typography>
                  </Grid>
                </Grid>
              </SellerCard>
            )}

            {/* Add to Cart Button */}
            {user && !isOwner && (
              <BuyButton 
                variant="contained" 
                color="primary"
                disableElevation
                onClick={handleAddToCart}
              >
                Add to Cart
              </BuyButton>
            )}
          </DetailsSection>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetails;
