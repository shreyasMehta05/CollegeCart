import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

/**
 * ScrollReveal component that animates children when they enter the viewport
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be revealed
 * @param {string} props.animation - Animation type: 'fade-up', 'fade-left', 'fade-right', 'zoom-in', 'rotate'
 * @param {number} props.delay - Delay before animation starts (in ms)
 * @param {number} props.threshold - Visibility threshold to trigger animation (0.1 - 1)
 * @param {Object} props.sx - Additional MUI sx props
 */
const ScrollReveal = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  threshold = 0.1, 
  sx = {} 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When element comes into view
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // Unobserve after animation is triggered
          observer.unobserve(elementRef.current);
        }
      }, 
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);

  const getAnimationStyles = () => {
    const baseStyles = {
      opacity: isVisible ? 1 : 0,
      transition: `transform 0.8s cubic-bezier(0.17, 0.55, 0.55, 1), opacity 0.8s cubic-bezier(0.17, 0.55, 0.55, 1)`,
      transitionDelay: `${delay}ms`,
    };
    
    switch (animation) {
      case 'fade-up':
        return {
          ...baseStyles,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        };
      case 'fade-down':
        return {
          ...baseStyles,
          transform: isVisible ? 'translateY(0)' : 'translateY(-40px)',
        };
      case 'fade-left':
        return {
          ...baseStyles,
          transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
        };
      case 'fade-right':
        return {
          ...baseStyles,
          transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
        };
      case 'zoom-in':
        return {
          ...baseStyles,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        };
      case 'zoom-out':
        return {
          ...baseStyles,
          transform: isVisible ? 'scale(1)' : 'scale(1.1)',
        };
      case 'rotate':
        return {
          ...baseStyles,
          transform: isVisible ? 'rotate(0deg)' : 'rotate(-5deg)',
        };
      case 'flip':
        return {
          ...baseStyles,
          transform: isVisible ? 'perspective(1000px) rotateY(0deg)' : 'perspective(1000px) rotateY(90deg)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Box
      ref={elementRef}
      sx={{
        ...getAnimationStyles(),
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default ScrollReveal;