// src/pages/ProductDetails.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Rating,
    TextField,
    Divider,
    CircularProgress,
    Alert,
    ImageList,
    ImageListItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/reviews/ReviewSection';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data.product);
        } catch (error) {
            setError('Error fetching product details');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        try {
            await axios.post('/api/cart/add', {
                productId: id,
                quantity
            });
            navigate('/cart');
        } catch (error) {
            setError('Error adding to cart');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!product) return <Alert severity="error">Product not found</Alert>;
    console.log("User:", user);
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <ImageList cols={1}>
                        {product.images?.map((image, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={image}
                                    alt={`Product image ${index + 1}`}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {product.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={product.ratings.average} readOnly precision={0.5} />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                ({product.ratings.count} reviews)
                            </Typography>
                        </Box>

                        <Typography variant="h5" color="primary" gutterBottom>
                            ₹{product.price}
                        </Typography>

                        <Typography variant="body1" paragraph>
                            {product.description}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Category: {product.category}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Condition: {product.condition}
                            </Typography>
                        </Box>

                        {user && user._id !== product.sellerId && (
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    type="number"
                                    label="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                    InputProps={{ inputProps: { min: 1 } }}
                                    sx={{ width: 100, mr: 2 }}
                                />
                                {
                                    user && user._id !== product.sellerId &&
                                    (<Button
                                        variant="contained"
                                        startIcon={<ShoppingCart />}
                                        onClick={addToCart}
                                    >
                                        Add to Cart
                                    </Button>)
                                }
                            </Box>
                        )}

                        <Button
                            variant="outlined"
                            startIcon={<Store />}
                            onClick={() => navigate(`/seller/${product.sellerId}`)}
                        >
                            View Seller
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <ReviewSection productId={id} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetails;