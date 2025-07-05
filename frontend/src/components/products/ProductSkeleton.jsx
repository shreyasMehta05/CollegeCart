import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';
import { keyframes } from '@mui/system';

// Create a shimmer effect animation
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const ProductSkeleton = () => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: 'translateX(-100%)',
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0))',
          animation: `${shimmer} 2s infinite`,
          zIndex: 1
        }
      }}
    >
      <Skeleton 
        variant="rectangular" 
        animation="wave"
        height={200} 
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.08)',
          transform: 'scale(1)',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          }
        }} 
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
        <Skeleton 
          variant="text" 
          animation="wave" 
          height={32} 
          width="70%" 
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)', borderRadius: 1 }} 
        />
        
        <Skeleton 
          variant="text" 
          animation="wave" 
          height={16} 
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)', borderRadius: 1 }} 
        />
        
        <Skeleton 
          variant="text" 
          animation="wave" 
          height={16} 
          width="80%" 
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)', borderRadius: 1 }} 
        />
        
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton 
            variant="rectangular" 
            animation="wave" 
            height={20} 
            width={100} 
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)', borderRadius: 1 }} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Skeleton 
            variant="rectangular" 
            animation="wave" 
            height={28} 
            width={80} 
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)', borderRadius: 1 }} 
          />
          
          <Skeleton 
            variant="rectangular" 
            animation="wave" 
            height={36} 
            width={80} 
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)', borderRadius: 2 }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductSkeleton;