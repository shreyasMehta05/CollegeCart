// src/components/products/ProductCard.js
import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Rating,
    Box,
    Chip
} from '@mui/material';
import { ShoppingCart, Store } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product, onClick }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' , cursor: 'pointer'}} onClick={onClick}>
            <CardMedia
                component="img"
                height="200"
                image={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                <Typography variant="h6" color="primary">
                    ₹{product.price}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.ratings.average} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.ratings.count})
                    </Typography>
                </Box>
                <Chip 
                    label={product.category} 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }} 
                />
                <Typography variant="body2" color="text.secondary">
                    {product.description.substring(0, 100)}...
                </Typography>
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    startIcon={<Store />}
                    onClick={() => navigate(`/seller/${product.sellerId}`)}
                >
                    View Seller
                </Button>
                {user && user._id !== product.sellerId && (
                    <Button 
                        size="small" 
                        color="primary"
                        startIcon={<ShoppingCart />}
                        onClick={() => navigate(`/product/${product._id}`)}
                    >
                        Add to Cart
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default ProductCard;