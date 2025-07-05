import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '@/utils/auth';
import { Box, Container, Typography, Button, Grid, Paper, useTheme } from '@mui/material';
import {
  ShoppingBagIcon, 
  BuildingStorefrontIcon as StoreIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon as UsersIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  StarIcon,
  ArrowRightIcon, 
  CheckCircleIcon,
  SparklesIcon,
  FireIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

// Styled component for gradient text
const GradientText = ({ children, gradient, ...props }) => {
  return (
    <Typography
      {...props}
      sx={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
      }}
    >
      {children}
    </Typography>
  );
};

// Enhanced animated background blob component
const AnimatedBlob = ({ top, left, right, bottom, size, color, delay, duration }) => (
  <Box
    sx={{
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
      filter: 'blur(50px)',
      opacity: 0.7,
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      '@keyframes float': {
        '0%': {
          transform: 'translateY(0) scale(1)',
        },
        '50%': {
          transform: 'translateY(-20px) scale(1.05)',
        },
        '100%': {
          transform: 'translateY(0) scale(1)',
        },
      },
    }}
  />
);

// Enhanced Feature Card component with hover animations
const FeatureCard = ({ icon, title, description, color }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Paper
      elevation={hovered ? 8 : 3}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 4,
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s, background 0.3s',
        position: 'relative',
        overflow: 'hidden',
        background: hovered ? 
          'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(246,249,252,1) 100%)' : 
          'white',
        '&:hover': {
          transform: 'translateY(-15px) scale(1.03)',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '6px',
          width: '100%',
          background: color,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease-out',
        }}
      />
      <Box
        sx={{
          mb: 3,
          mt: 1,
          display: 'inline-flex',
          p: 2.5,
          borderRadius: '16px',
          background: hovered ? color : 'rgba(0,0,0,0.03)',
          mx: 'auto',
          transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s',
          boxShadow: hovered ? '0 10px 20px -5px rgba(0,0,0,0.2)' : 'none',
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h5" 
        fontWeight="bold" 
        gutterBottom
        sx={{ 
          mb: 2,
          position: 'relative',
          display: 'inline-block',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -6,
            left: '50%',
            width: hovered ? '80%' : '0%',
            height: '3px',
            background: color,
            transition: 'width 0.3s ease',
            transform: 'translateX(-50%)',
          }
        }}
      >
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Paper>
  );
};

// Enhanced Testimonial Card component with improved design
const TestimonialCard = ({ name, role, content, rating, avatar, index }) => {
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  
  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        height: '100%',
        perspective: '1000px',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          borderRadius: '24px',
          boxShadow: hovered 
            ? '0 22px 40px rgba(0, 0, 0, 0.3)' 
            : '0 10px 30px rgba(0, 0, 0, 0.15)',
          transform: hovered ? 'translateY(-12px) rotateY(10deg)' : 'translateY(0) rotateY(0)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s ease',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(45, 55, 72, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%)'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.85) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.7)',
          padding: { xs: 3, md: 4 },
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            left: -40,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${
              theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'
            } 0%, ${
              theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'
            } 100%)`,
            zIndex: 0,
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${
              theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)'
            } 0%, ${
              theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
            } 100%)`,
            zIndex: 0,
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        
        {/* Quote icon */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            fontSize: '3rem',
            fontFamily: 'Georgia, serif',
            color: hovered
              ? theme.palette.mode === 'dark' ? 'rgba(255, 193, 7, 0.3)' : 'rgba(245, 158, 11, 0.2)'
              : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            zIndex: 1,
            transition: 'color 0.3s ease, transform 0.5s ease',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          "
        </Box>
        
        {/* Rating */}
        <Box 
          sx={{ 
            position: 'relative',
            display: 'flex', 
            mb: 3,
            zIndex: 1,
            transition: 'transform 0.4s ease',
            transform: hovered ? 'translateX(5px)' : 'translateX(0)',
          }}
        >
          {[...Array(rating)].map((_, i) => (
            <StarIcon 
              key={i} 
              style={{ 
                width: 22, 
                height: 22, 
                color: '#FFC107',
                filter: hovered ? 'drop-shadow(0 0 3px rgba(255, 193, 7, 0.6))' : 'none',
                transition: 'transform 0.2s ease',
                transform: hovered ? `scale(${1.1 - i * 0.05})` : 'scale(1)',
              }} 
            />
          ))}
        </Box>
        
        {/* Testimonial content */}
        <Typography 
          variant="body1" 
          sx={{ 
            position: 'relative',
            mb: 4, 
            fontStyle: 'italic', 
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.9)',
            lineHeight: 1.8,
            fontSize: '1.05rem',
            zIndex: 1,
            textAlign: 'left',
            height: '120px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: hovered ? '0' : '30px',
              background: hovered 
                ? 'transparent' 
                : `linear-gradient(to top, ${
                    theme.palette.mode === 'dark' 
                      ? 'rgba(30, 41, 59, 0.95)'
                      : 'rgba(248, 250, 252, 0.95)'
                  }, transparent)`,
              transition: 'height 0.3s ease',
            }
          }}
        >
          "{content}"
        </Typography>
        
        {/* User info */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            mt: 'auto',
          }}
        >
          {/* Avatar */}
          <Box
            sx={{
              position: 'relative',
              width: 50,
              height: 50,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              mr: 2,
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                background: `linear-gradient(45deg, 
                  hsl(${43 + index * 40}, 90%, 55%), 
                  hsl(${63 + index * 40}, 90%, 60%))`,
                boxShadow: hovered 
                  ? '0 6px 15px rgba(255, 193, 7, 0.4)'
                  : '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
              }}
            />
            <Typography
              sx={{
                position: 'relative',
                zIndex: 1,
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 700,
              }}
            >
              {avatar}
            </Typography>
          </Box>
          
          {/* Name & role */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.1rem',
                color: theme.palette.mode === 'dark' ? 'white' : 'rgba(15, 23, 42, 0.9)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'transform 0.4s ease',
                transform: hovered ? 'translateX(5px)' : 'translateX(0)',
              }}
            >
              {name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(71, 85, 105, 0.9)',
                fontSize: '0.85rem',
                display: 'block',
                transition: 'transform 0.4s ease',
                transform: hovered ? 'translateX(5px)' : 'translateX(0)',
              }}
            >
              {role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Testimonial Card component with enhanced animation
const TestimonialCardOld = ({ name, role, content, rating, avatar }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Paper
      elevation={hovered ? 10 : 3}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        height: '100%',
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          borderWidth: '0 40px 40px 0',
          borderStyle: 'solid',
          borderColor: 'transparent rgba(255, 193, 7, 0.6) transparent transparent',
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.2)' : 'scale(1)',
        }}
      />
      <Box sx={{ display: 'flex', mb: 3, transition: 'transform 0.3s', transform: hovered ? 'scale(1.1)' : 'scale(1)' }}>
        {[...Array(rating)].map((_, i) => (
          <StarIcon key={i} style={{ color: '#FFC107', width: 22, height: 22, filter: hovered ? 'drop-shadow(0 0 3px rgba(255, 193, 7, 0.8))' : 'none' }} />
        ))}
      </Box>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 4, 
          fontStyle: 'italic', 
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.8,
          position: 'relative',
          '&:before': {
            content: '"""',
            fontFamily: 'Georgia, serif',
            fontSize: '4rem',
            color: 'rgba(255,255,255,0.2)',
            position: 'absolute',
            top: -20,
            left: -10,
          }
        }}
      >
        "{content}"
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #FFC107, #FF9800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold',
            mr: 2,
            fontSize: '1.1rem',
            boxShadow: hovered ? '0 0 15px rgba(255, 193, 7, 0.6)' : 'none',
            transition: 'box-shadow 0.3s, transform 0.3s',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {avatar}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
            {role}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

// Step Card component with enhanced animation
const StepCard = ({ step, title, description, icon }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Box 
      sx={{ 
        textAlign: 'center',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ position: 'relative', mb: 3, mx: 'auto' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hovered 
              ? '0 15px 25px -5px rgba(59, 130, 246, 0.6), 0 0 15px 2px rgba(139, 92, 246, 0.3)' 
              : '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
            mx: 'auto',
            transition: 'transform 0.4s, box-shadow 0.4s',
            transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: -5,
            right: -5,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#FFC107',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            border: '2px solid white',
            transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.2) translateX(-5px)' : 'scale(1)',
            zIndex: 2,
          }}
        >
          {step}
        </Box>
      </Box>
      <Typography 
        variant="h5" 
        fontWeight="bold" 
        sx={{ 
          mb: 2,
          color: hovered ? '#3b82f6' : 'inherit',
          transition: 'color 0.3s',
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ 
          maxWidth: '90%', 
          mx: 'auto',
          lineHeight: 1.7,
          fontSize: '1rem',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

// Animated button component
const AnimatedButton = ({ 
  children, 
  startIcon, 
  endIcon, 
  variant = "contained", 
  onClick,
  primary,
  secondary,
  ...props 
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        px: 4,
        py: 1.8,
        fontSize: '1.1rem',
        fontWeight: 600,
        borderRadius: '30px',
        textTransform: 'none',
        boxShadow: variant === 'contained' ? '0 10px 20px -5px rgba(0,0,0,0.2)' : 'none',
        transition: 'transform 0.3s, box-shadow 0.3s, background 0.3s',
        '&:hover': {
          transform: 'translateY(-3px) scale(1.02)',
          boxShadow: variant === 'contained' ? '0 15px 25px -5px rgba(0,0,0,0.3)' : 'none',
          ...props.sx?.['&:hover'],
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: variant === 'contained' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          transform: hovered ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.5s ease',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// Animated CountUp component for statistics
const AnimatedStat = ({ number, label, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const statRef = React.useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (statRef.current) {
      observer.observe(statRef.current);
    }
    
    return () => {
      if (statRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = parseInt(number.replace(/[^\d]/g, ''));
    const duration = 2000;
    const startTime = Date.now();
    
    const timer = setTimeout(() => {
      const animateStat = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animateStat);
        }
      };
      
      requestAnimationFrame(animateStat);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isVisible, number, delay]);
  
  const hasUnit = /[^\d]/.test(number);
  const unit = hasUnit ? number.replace(/[\d]/g, '') : '';
  
  return (
    <Box ref={statRef} sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontSize: { xs: '1.75rem', md: '2.5rem' }, 
          fontWeight: 700, 
          background: 'linear-gradient(to right, #FFC107, #FF9800)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {count}{unit}
      </Typography>
      <Typography 
        sx={{ 
          color: 'rgba(219, 234, 254, 0.8)', 
          fontWeight: 500,
          fontSize: '1.1rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const user = authUtils.getUser();
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enhanced features with more detailed descriptions
  const features = [
    {
      icon: <ShoppingBagIcon style={{ width: 32, height: 32, color: 'white' }} />,
      title: "Smart Shopping",
      description: "Our AI-powered recommendation system learns your preferences to suggest relevant items. Find exactly what you need at the best prices, all verified by fellow students.",
      color: "linear-gradient(45deg, #3b82f6, #06b6d4)"
    },
    {
      icon: <StoreIcon style={{ width: 32, height: 32, color: 'white' }} />,
      title: "Easy Selling",
      description: "List your items in seconds with our streamlined process. Set your price, upload photos, and reach thousands of potential buyers on campus instantly.",
      color: "linear-gradient(45deg, #8b5cf6, #ec4899)"
    },
    {
      icon: <ShieldCheckIcon style={{ width: 32, height: 32, color: 'white' }} />,
      title: "Secure & Safe",
      description: "Every transaction is protected with our escrow system. Funds are released only when both parties are satisfied, ensuring a safe trading experience every time.",
      color: "linear-gradient(45deg, #10b981, #059669)"
    },
    {
      icon: <TruckIcon style={{ width: 32, height: 32, color: 'white' }} />,
      title: "Fast Delivery",
      description: "Our network of student couriers ensures same-day delivery within campus. Track your items in real-time and get notifications when they're on the way.",
      color: "linear-gradient(45deg, #f59e0b, #ef4444)"
    },
    {
      icon: <UsersIcon style={{ width: 32, height: 32, color: 'white' }} />,
      title: "Community Driven",
      description: "Join a vibrant network of students helping each other save money. Exchange tips, share reviews, and build connections beyond just buying and selling.",
      color: "linear-gradient(45deg, #6366f1, #8b5cf6)"
    },
    {
      icon: <RocketLaunchIcon style={{ width: 32, height: 32, color: 'white' }} />,
      title: "Growing Fast",
      description: "Be part of the fastest growing campus marketplace. We're constantly adding new features based on student feedback to make your experience even better.",
      color: "linear-gradient(45deg, #14b8a6, #3b82f6)"
    }
  ];

  // Enhanced testimonials with more detailed content
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Computer Science Major",
      content: "CollegeCart changed my campus life! I sold my old textbooks in hours and made enough to cover my coffee for the semester. The secure payment system gave me total peace of mind.",
      rating: 5,
      avatar: "AC"
    },
    {
      name: "Priya Sharma",
      role: "Business Analytics",
      content: "Found an almost-new iPad for half the retail price! Delivery was same-day and the seller even included a free case. This platform is a game-changer for budget-conscious students.",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Jordan Kim",
      role: "Engineering Student",
      content: "As an international student, finding affordable dorm essentials was challenging until I discovered CollegeCart. The community is incredibly helpful and the platform is super intuitive.",
      rating: 5,
      avatar: "JK"
    },
    {
      name: "Olivia Martinez",
      role: "Pre-Med Student",
      content: "I saved over $300 on my textbooks this semester! The condition ratings were spot on, and I love how easy it is to message sellers. Plus, the payment protection made me feel safe.",
      rating: 4,
      avatar: "OM"
    },
    {
      name: "Marcus Johnson",
      role: "Film Studies",
      content: "Sold my camera equipment in under 24 hours when I needed emergency cash. The transaction was smooth, secure, and the buyer even picked it up from my dorm. Absolutely recommend!",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Zoe Williams",
      role: "Environmental Science",
      content: "The sustainability aspect of CollegeCart is what won me over. Giving items a second life while helping fellow students save money is exactly what our campus needed.",
      rating: 5,
      avatar: "ZW"
    }
  ];

  // Track active testimonial and auto-scroll
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);
  
  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Scroll to active testimonial
  useEffect(() => {
    if (testimonialRef.current) {
      const scrollContainer = testimonialRef.current;
      const scrollWidth = scrollContainer.scrollWidth;
      const containerWidth = scrollContainer.clientWidth;
      
      // Only auto-scroll on larger screens - mobile uses swipeable cards
      if (window.innerWidth >= 768) {
        const scrollPosition = (scrollWidth / testimonials.length) * activeTestimonial;
        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [activeTestimonial, testimonials.length]);
  
  // Enhanced statistics with more impressive numbers
  const stats = [
    { number: "15K+", label: "Active Students" },
    { number: "87K+", label: "Items Traded" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 5, md: 0 },
        }}
      >
        {/* Dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.15)',
            zIndex: 1,
          }}
        />
        
        {/* Animated background elements */}
        <AnimatedBlob 
          top="5%" 
          left="10%" 
          size="18rem" 
          color="rgba(59, 130, 246, 0.35)" 
          delay={0} 
          duration={7}
        />
        <AnimatedBlob 
          bottom="15%" 
          right="8%" 
          size="20rem" 
          color="rgba(139, 92, 246, 0.3)" 
          delay={1.5} 
          duration={8}
        />
        <AnimatedBlob 
          top="40%" 
          right="15%" 
          size="10rem" 
          color="rgba(236, 72, 153, 0.2)" 
          delay={1} 
          duration={6}
        />
        <AnimatedBlob 
          bottom="30%" 
          left="15%" 
          size="12rem" 
          color="rgba(6, 182, 212, 0.25)" 
          delay={2} 
          duration={7.5}
        />
        
        {/* Dot pattern overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            zIndex: 1,
          }}
        />
        
        <Container
          sx={{
            py: { xs: 10, sm: 12, md: 16 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Box 
            sx={{
              textAlign: 'center', 
              maxWidth: '65rem',
              mx: 'auto',
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1s ease-out, opacity 1s ease-out',
            }}
          >
            {/* Badge */}
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mb: 4,
                animation: 'pulse 2s infinite',
              }}
            >
              <SparklesIcon style={{ width: 24, height: 24, color: '#FFC107', marginRight: 10 }} />
              <Typography
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  px: 3,
                  py: 1,
                  borderRadius: '30px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                #1 CAMPUS MARKETPLACE
              </Typography>
            </Box>
            
            {/* Main heading with enhanced gradient effect */}
            <GradientText 
              variant="h1" 
              component="h1" 
              fontWeight="900" 
              gradient="linear-gradient(to right, #ffffff, #bfdbfe)" 
              gutterBottom
              sx={{ 
                mb: 3, 
                fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                textShadow: '0 10px 20px rgba(0,0,0,0.15)',
              }}
            >
              Welcome to
              <br />
              <GradientText 
                component="span"
                gradient="linear-gradient(to right, #FFC107, #FF9800)"
                sx={{ 
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 8,
                    left: 10,
                    width: '95%',
                    height: '20%',
                    background: 'rgba(255, 193, 7, 0.3)',
                    zIndex: -1,
                    borderRadius: '30px',
                    transform: 'rotate(-1deg)',
                  }
                }}
              >
                CollegeCart
              </GradientText>
            </GradientText>
            
            {/* Enhanced subtitle with better typography */}
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 5, 
                color: 'rgba(219, 234, 254, 0.95)',
                maxWidth: '42rem',
                mx: 'auto',
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Your premier platform for seamless campus trading and community connections. 
              Buy, sell, and discover amazing deals from fellow students with total confidence.
            </Typography>
            
            {/* Enhanced call-to-action buttons */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3, 
                justifyContent: 'center',
                mb: 8,
              }}
            >
              <AnimatedButton
                variant="contained"
                onClick={() => navigate('/products')}
                startIcon={<ShoppingBagIcon style={{ width: 20, height: 20 }} />}
                endIcon={<ArrowRightIcon style={{ width: 20, height: 20 }} />}
                sx={{
                  backgroundColor: 'white',
                  color: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  }
                }}
              >
                Start Shopping
              </AnimatedButton>
              
              <AnimatedButton
                variant="outlined"
                onClick={() => {
                  if (user) {
                    navigate('/seller/dashboard');
                  } else {
                    navigate('/login');
                  }
                }}
                startIcon={<StoreIcon style={{ width: 20, height: 20 }} />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  borderWidth: '2px',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Sell Your Items
              </AnimatedButton>
            </Box>
            
            {/* Enhanced Stats with animations */}
            <Grid container spacing={4} sx={{ maxWidth: '52rem', mx: 'auto', mt: 2 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <AnimatedStat number={stat.number} label={stat.label} delay={index * 200} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
        
        {/* Wave separator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
            zIndex: 2,
            transform: 'rotate(180deg)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: 'relative',
              display: 'block',
              width: 'calc(100% + 1.3px)',
              height: '50px',
              transform: 'rotateY(180deg)',
            }}
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
            ></path>
          </svg>
        </Box>
      </Box>

      {/* Enhanced Features Section with animation */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 16 }, 
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                mb: 2,
                px: 2.5,
                py: 1,
                borderRadius: '20px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              }}
            >
              <LightBulbIcon style={{ width: 18, height: 18, color: '#3b82f6', marginRight: 8 }} />
              <Typography 
                sx={{ 
                  color: '#3b82f6', 
                  fontWeight: 600, 
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                }}
              >
                WHY CHOOSE US
              </Typography>
            </Box>
            
            <GradientText
              variant="h2"
              fontWeight="bold"
              gradient="linear-gradient(to right, #1e293b, #475569)"
              sx={{ mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}
            >
              A New Way to Trade on Campus
            </GradientText>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '42rem', 
                mx: 'auto',
                fontSize: '1.25rem',
                lineHeight: 1.7,
              }}
            >
              Experience a secure, fast, and community-driven marketplace with features
              designed specifically for students' needs and budget-conscious lifestyles.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid 
                item 
                xs={12} 
                md={6} 
                lg={4} 
                key={index} 
                sx={{ 
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
                }}
              >
                <FeatureCard 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description} 
                  color={feature.color}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Redesigned Reviews Section */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 16 }, 
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #bfdbfe 0%, #ede9fe 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.5,
            backgroundImage: theme.palette.mode === 'dark'
              ? 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)'
              : 'radial-gradient(rgba(15, 23, 42, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Animated blobs */}
        <AnimatedBlob 
          top="10%" 
          left="5%" 
          size="20rem" 
          color={theme.palette.mode === 'dark' 
            ? 'rgba(59, 130, 246, 0.03)' 
            : 'rgba(59, 130, 246, 0.05)'} 
          delay={0} 
          duration={8}
        />
        <AnimatedBlob 
          bottom="5%" 
          right="5%" 
          size="25rem" 
          color={theme.palette.mode === 'dark'
            ? 'rgba(139, 92, 246, 0.03)'
            : 'rgba(139, 92, 246, 0.05)'} 
          delay={1} 
          duration={9}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
            {/* Section Badge */}
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                mb: 3,
                px: 3,
                py: 1.5,
                borderRadius: '30px',
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            >
              <StarIcon 
                style={{ 
                  width: 24, 
                  height: 24, 
                  color: '#FFC107', 
                  marginRight: 12,
                  filter: 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.4))'
                }} 
              />
              <Typography 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'white' : '#1e293b', 
                  fontWeight: 700, 
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Student Testimonials
              </Typography>
            </Box>
            
            {/* Section Title */}
            <Typography 
              variant="h2" 
              component="h2"
              fontWeight="800"
              sx={{ 
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(to right, #f8fafc, #bfdbfe)'
                  : 'linear-gradient(to right, #1e40af, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              Voices of Our Community
            </Typography>
            
            {/* Section Subtitle */}
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.mode === 'dark' 
                  ? 'rgba(226, 232, 240, 0.9)'
                  : 'rgba(30, 41, 59, 0.8)', 
                maxWidth: '50rem', 
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              See what fellow students are saying about their experiences with CollegeCart,
              from finding affordable textbooks to selling items they no longer need.
            </Typography>
            
            {/* Testimonial Stats */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: { xs: 3, md: 5 },
                mb: { xs: 6, md: 8 },
              }}
            >
              {[
                { number: '4.9', label: 'Average Rating', icon: '⭐' },
                { number: '94%', label: 'Would Recommend', icon: '👍' },
                { number: '15K+', label: 'Happy Students', icon: '🎓' }
              ].map((stat, i) => (
                <Box 
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(30, 41, 59, 0.6)'
                      : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(8px)',
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                      : '0 4px 12px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      mr: 1.5,
                      filter: 'grayscale(0%)',
                    }}
                  >
                    {stat.icon}
                  </Typography>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: theme.palette.mode === 'dark' ? 'white' : '#1e293b',
                        lineHeight: 1.2,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.mode === 'dark' 
                          ? 'rgba(226, 232, 240, 0.7)'
                          : 'rgba(71, 85, 105, 0.9)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Testimonial Cards - Desktop Carousel */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              ref={testimonialRef}
              sx={{
                display: 'flex',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                px: 2,
                pb: 4,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: '0 0 33.333%',
                    px: 2,
                    opacity: Math.abs(activeTestimonial - index) > 1 ? 0.4 : 1,
                    transition: 'opacity 0.5s ease',
                  }}
                >
                  <TestimonialCard
                    name={testimonial.name}
                    role={testimonial.role}
                    content={testimonial.content}
                    rating={testimonial.rating}
                    avatar={testimonial.avatar}
                    index={index}
                  />
                </Box>
              ))}
            </Box>
            
            {/* Navigation Dots */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1.5,
                mt: 4,
              }}
            >
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    backgroundColor: activeTestimonial === index
                      ? theme.palette.mode === 'dark' ? 'white' : '#1e293b'
                      : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 23, 42, 0.2)',
                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                    transform: activeTestimonial === index ? 'scale(1.2)' : 'scale(1)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.6)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {/* Testimonial Cards - Mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Box
              sx={{
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                display: 'flex',
                pb: 4,
                px: 2,
              }}
            >
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <Box
                  key={index}
                  sx={{
                    flexShrink: 0,
                    width: {
                      xs: 'calc(100% - 32px)',
                      sm: 'calc(85% - 32px)',
                    },
                    scrollSnapAlign: 'center',
                    mx: 2,
                  }}
                >
                  <TestimonialCard
                    name={testimonial.name}
                    role={testimonial.role}
                    content={testimonial.content}
                    rating={testimonial.rating}
                    avatar={testimonial.avatar}
                    index={index}
                  />
                </Box>
              ))}
            </Box>
            
            {/* Mobile Indicator */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.6)',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                }}
              >
                Swipe to see more testimonials
              </Typography>
            </Box>
          </Box>
          
          {/* Call to action */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <AnimatedButton
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #3b82f6 0%, #8b5cf6 100%)'
                  : 'linear-gradient(45deg, #1e40af 0%, #4f46e5 100%)',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Join Our Community Today
            </AnimatedButton>
          </Box>
        </Container>
      </Box>

      {/* Enhanced CTA Section */}
      {!user && (
        <Box 
          sx={{ 
            py: { xs: 10, md: 16 }, 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '5%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)',
              borderRadius: '50%',
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '8%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 70%)',
              borderRadius: '50%',
            }}
          />
          
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box 
                sx={{
                  display: 'inline-block',
                  mb: 3,
                  position: 'relative',
                }}
              >
                <FireIcon
                  style={{ 
                    width: 35, 
                    height: 35, 
                    color: '#FFC107',
                    filter: 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.6))',
                  }}
                />
              </Box>
              
              <Typography 
                variant="h2" 
                fontWeight="800" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(to right, #f8fafc, #94a3b8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Join CollegeCart?
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(209, 213, 219, 0.9)', 
                  mb: 5,
                  maxWidth: '45rem', 
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                Join thousands of students who are already buying and selling on CollegeCart. 
                Your next great deal is just a click away!
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3, 
                  justifyContent: 'center',
                  mb: 5,
                }}
              >
                <AnimatedButton
                  variant="contained"
                  onClick={() => navigate('/register')}
                  startIcon={<CheckCircleIcon style={{ width: 20, height: 20 }} />}
                  endIcon={<ArrowRightIcon style={{ width: 20, height: 20 }} />}
                  sx={{
                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                    color: 'white',
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                    },
                  }}
                >
                  Create Free Account
                </AnimatedButton>
                
                <AnimatedButton
                  variant="outlined"
                  onClick={() => navigate('/products')}
                  sx={{
                    borderColor: 'rgba(148, 163, 184, 0.5)',
                    borderWidth: '2px',
                    color: 'rgba(226, 232, 240, 0.9)',
                    '&:hover': {
                      borderColor: 'rgba(226, 232, 240, 0.9)',
                      backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    },
                  }}
                >
                  Browse First
                </AnimatedButton>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
                {[
                  { icon: <CheckCircleIcon style={{ width: 18, height: 18 }} />, text: "No credit card required" },
                  { icon: <CheckCircleIcon style={{ width: 18, height: 18 }} />, text: "Free forever" },
                  { icon: <CheckCircleIcon style={{ width: 18, height: 18 }} />, text: "2 minute setup" }
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#3b82f6' }}>{item.icon}</Box>
                    <Typography variant="body2" sx={{ color: 'rgba(209, 213, 219, 0.8)' }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Home;
