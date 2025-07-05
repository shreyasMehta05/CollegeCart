import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Chip, Rating, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';

// Motion components
const MotionCard = motion(Card);
const MotionCardMedia = motion(CardMedia);
const MotionBox = motion(Box);
const MotionChip = motion(Chip);
const MotionIconButton = motion(IconButton);

const AnimatedProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(product._id);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product._id);
    }
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <MotionCard
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 30px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
      }}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {product?.discount > 0 && (
          <MotionChip
            label={`${product.discount}% OFF`}
            size="small"
            color="error"
            sx={{ 
              position: 'absolute', 
              top: 12, 
              left: 12, 
              fontWeight: 'bold',
              zIndex: 2
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          />
        )}

        <MotionIconButton
          size="small"
          onClick={handleFavoriteToggle}
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            background: 'rgba(255,255,255,0.8)',
            zIndex: 2,
            '&:hover': { background: 'rgba(255,255,255,0.9)' }
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {isFavorite ? (
            <FavoriteIcon color="error" fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </MotionIconButton>

        <MotionCardMedia
          component="img"
          height="200"
          image={product?.image || 'https://via.placeholder.com/300'}
          alt={product?.name}
          sx={{ objectFit: 'cover', transform: 'scale(1)' }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        {isHovered && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              padding: '40px 16px 16px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Tooltip title="Add to cart">
              <MotionIconButton
                onClick={handleAddToCart}
                size="large"
                color="primary"
                sx={{ 
                  background: 'white',
                  '&:hover': { background: '#f0f0f0' }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AddShoppingCartIcon />
              </MotionIconButton>
            </Tooltip>
          </MotionBox>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product?.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product?.description}
        </Typography>

        <Box sx={{ mt: 0.5, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating 
            value={product?.rating || 0} 
            precision={0.5} 
            size="small" 
            readOnly 
          />
          <Typography variant="body2" color="text.secondary">
            ({product?.numReviews || 0})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            {product?.discount > 0 && (
              <Typography 
                variant="body2" 
                sx={{ 
                  textDecoration: 'line-through', 
                  color: 'text.secondary',
                  fontWeight: 400
                }}
              >
                ${product?.price}
              </Typography>
            )}
            <Typography 
              variant="h6" 
              component="span" 
              sx={{ 
                fontWeight: 700,
                color: product?.discount > 0 ? 'error.main' : 'inherit'
              }}
            >
              ${product?.discountedPrice || product?.price}
            </Typography>
          </Box>

          {product?.stock > 0 ? (
            <Chip 
              size="small" 
              label={product?.stock < 5 ? `${product?.stock} left` : 'In Stock'} 
              color={product?.stock < 5 ? 'warning' : 'success'}
              sx={{ height: 24 }}
            />
          ) : (
            <Chip 
              size="small" 
              label="Out of Stock" 
              color="error"
              sx={{ height: 24 }}
            />
          )}
        </Box>
      </CardContent>

      {/* Quick stats that appear on hover */}
      {isHovered && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          sx={{
            position: 'absolute',
            top: 8,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {product?.tags && product.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ 
                mx: 0.5, 
                background: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            />
          ))}
        </MotionBox>
      )}
    </MotionCard>
  );
};

export default AnimatedProductCard;