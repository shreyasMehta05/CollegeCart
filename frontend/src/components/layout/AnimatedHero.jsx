import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Grid, useTheme } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const AnimatedHero = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effects based on scroll position
  const heroTextY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroImageY = useTransform(scrollY, [0, 500], [0, 70]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Product images for the floating animation
  const productImages = [
    '/images/product1.jpg', 
    '/images/product2.jpg',
    '/images/product3.jpg',
    '/images/product4.jpg'
  ];

  return (
    <Box 
      sx={{ 
        position: 'relative',
        minHeight: '85vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f1f9 100%)',
        pt: 8,
        pb: 10,
      }}
    >
      {/* Background animated shapes */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <MotionBox
            key={i}
            sx={{
              position: 'absolute',
              width: ['80px', '100px', '120px', '150px'][i % 4],
              height: ['80px', '100px', '120px', '150px'][i % 4],
              borderRadius: '50%',
              background: `rgba(${[59, 130, 246, 0.05 + (i % 3) * 0.03]})`,
            }}
            initial={{ 
              x: `${(i % 3) * 30 - 10}%`, 
              y: `${(i % 2) * 40 + 10}%`, 
              opacity: 0.3 + (i % 3) * 0.1 
            }}
            animate={{ 
              x: [
                `${(i % 3) * 30 - 10}%`, 
                `${(i % 3) * 30 - 10 + (i % 2 ? 5 : -5)}%`, 
                `${(i % 3) * 30 - 10}%`
              ],
              y: [
                `${(i % 2) * 40 + 10}%`, 
                `${(i % 2) * 40 + 10 + (i % 2 ? -7 : 7)}%`, 
                `${(i % 2) * 40 + 10}%`
              ],
              scale: [1, 1.05, 1],
              opacity: [0.3 + (i % 3) * 0.1, 0.4 + (i % 3) * 0.1, 0.3 + (i % 3) * 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox style={{ y: heroTextY, opacity: heroOpacity }}>
              <MotionTypography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  mb: 2,
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.025em',
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                College Essentials, <br /> 
                Campus Prices
              </MotionTypography>

              <MotionTypography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: '90%', lineHeight: 1.6 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Shop for textbooks, electronics, dorm essentials, and more. 
                By students, for students - with campus delivery and unbeatable prices.
              </MotionTypography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <MotionButton
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate('/products')}
                  sx={{
                    borderRadius: '50px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0px 10px 20px rgba(59, 130, 246, 0.3)',
                    backgroundColor: '#3b82f6',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                      boxShadow: '0px 15px 25px rgba(59, 130, 246, 0.4)',
                    },
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: '#2563eb',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now
                </MotionButton>

                <MotionButton
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/products')}
                  sx={{
                    borderRadius: '50px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    },
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: '#2563eb',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </MotionButton>
              </Box>
            </MotionBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionBox 
              style={{ y: heroImageY, opacity: heroOpacity }}
              sx={{ position: 'relative', height: '500px' }}
            >
              {/* Main circular image */}
              <MotionBox
                component="img"
                src="/path/to/main-image.jpg" /* Replace with actual image path */
                alt="College Student Shopping"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60%',
                  maxWidth: '350px',
                  borderRadius: '50%',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '10px solid white',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  x: mousePosition.x * 20 - 10,
                  y: mousePosition.y * 20 - 10,
                }}
              />

              {/* Floating product images */}
              {[...Array(4)].map((_, i) => (
                <MotionBox
                  key={i}
                  component="img"
                  src={productImages[i] || 'https://via.placeholder.com/150'}
                  alt={`Product ${i + 1}`}
                  sx={{
                    position: 'absolute',
                    width: ['80px', '100px', '90px', '110px'][i],
                    height: ['80px', '100px', '90px', '110px'][i],
                    borderRadius: '20px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    border: '5px solid white',
                    objectFit: 'cover',
                    top: ['20%', '65%', '30%', '75%'][i],
                    left: ['15%', '25%', '75%', '70%'][i],
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: i % 2 ? 10 : -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
                  style={{
                    x: mousePosition.x * (i + 1) * 5 * (i % 2 ? 1 : -1),
                    y: mousePosition.y * (i + 1) * 5 * (i % 2 ? -1 : 1),
                  }}
                />
              ))}
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AnimatedHero;