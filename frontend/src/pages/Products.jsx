import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Slider,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  Rating,
  InputAdornment,
  Fade,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Badge,
  Divider,
  useMediaQuery,
  Drawer,
  Tooltip,
  Container,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Search, 
  FilterList, 
  Sort, 
  GridView, 
  ViewList, 
  Close, 
  AddShoppingCart,
  LocalOffer,
  Star,
  TrendingUp,
  FilterAlt,
  BookmarkBorder,
  Bookmark,
  ArrowDropDown,
  HighlightOff,
  SentimentDissatisfied,
  AttachMoney
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '@/utils/auth';
import { motion } from 'framer-motion';

// Styled Components
const FilterContainer = styled(Paper)(({ theme }) => ({
  borderRadius: '24px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  padding: 0,
  maxHeight: '85vh',
  position: 'sticky',
  top: theme.spacing(2),
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(3),
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    borderRadius: '10px'
  },
  transition: 'all 0.3s ease',
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255,255,255,0.1)'
    : '1px solid rgba(0,0,0,0.06)',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8))' 
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))',
  backdropFilter: 'blur(12px)',
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 2.5),
  borderBottom: theme.palette.mode === 'dark'
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(0,0,0,0.06)',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #1e293b, #0f172a)' 
    : 'linear-gradient(145deg, #ffffff, #f8fafc)',
  borderRadius: '24px 24px 0 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 5,
}));

const FilterBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    transition: 'all 0.3s ease',
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(255,255,255,0.1)'
      : '1px solid rgba(0,0,0,0.06)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.04)',
      border: theme.palette.mode === 'dark' 
        ? '1px solid rgba(255,255,255,0.2)'
        : '1px solid rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
      border: `1px solid ${theme.palette.primary.main}`,
    },
  }
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
  '&:not(:last-child)': {
    paddingBottom: theme.spacing(3.5),
    borderBottom: theme.palette.mode === 'dark'
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.06)',
  },
}));

const FilterSectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
    fontSize: '1.3rem',
    filter: theme.palette.mode === 'dark' 
      ? 'drop-shadow(0 0 3px rgba(79, 70, 229, 0.3))'
      : 'drop-shadow(0 0 3px rgba(79, 70, 229, 0.15))',
  }
}));

const ProductsGrid = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2)
  }
}));

const CategoryLabel = styled(FormControlLabel)(({ theme }) => ({
  marginRight: 0,
  width: '100%',
  borderRadius: '12px',
  padding: theme.spacing(0.7, 1.2),
  transition: 'all 0.25s',
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.03)',
    transform: 'translateX(2px)',
  },
  '& .MuiCheckbox-root': {
    padding: theme.spacing(0.7),
    borderRadius: '6px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.04)',
    }
  },
  '& .Mui-checked': {
    '& + .MuiFormControlLabel-label': {
      fontWeight: 600,
    }
  }
}));

const PriceRangeBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 2),
  borderRadius: '16px',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.5))'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(249, 250, 251, 0.5))',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255,255,255,0.1)'
    : '1px solid rgba(0,0,0,0.05)',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const RatingBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '16px',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.5))'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(249, 250, 251, 0.5))',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255,255,255,0.1)'
    : '1px solid rgba(0,0,0,0.05)',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: '14px',
  padding: theme.spacing(1.2, 2),
  fontWeight: 600,
  textTransform: 'none',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, #3b82f6, #4f46e5)'
    : 'linear-gradient(145deg, #4f46e5, #6366f1)',
  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.2)',
  transition: 'all 0.3s',
  border: 'none',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
    transform: 'translateY(-1px)',
  }
}));

const PriceField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(15, 23, 42, 0.6)'
      : 'rgba(255, 255, 255, 0.8)',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255,255,255,0.1)'
      : '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(15, 23, 42, 0.8)'
        : 'rgba(255, 255, 255, 1)',
      border: theme.palette.mode === 'dark'
        ? '1px solid rgba(255,255,255,0.2)'
        : '1px solid rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(15, 23, 42, 0.9)'
        : 'rgba(255, 255, 255, 1)',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
      border: `1px solid ${theme.palette.primary.main}`,
    }
  }
}));

// Modern product card
const ProductCard = styled(motion.div)(({ theme, view }) => ({
  height: view === 'grid' ? '100%' : 'auto',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: view === 'grid' ? 'column' : 'row',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: view === 'grid' ? 'translateY(-8px)' : 'translateY(-4px)',
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '& .product-image': {
      transform: view === 'grid' ? 'scale(1.05)' : 'scale(1.02)',
    }
  }
}));

const ProductImageContainer = styled(Box)(({ theme, view }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: view === 'grid' ? '200px' : '140px',
  width: view === 'grid' ? '100%' : '140px',
  borderRadius: view === 'grid' ? '16px 16px 0 0' : '16px 0 0 16px',
}));

const ProductImage = styled('img')(({ theme, view }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
}));

const ProductInfo = styled(Box)(({ theme, view }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  flex: view === 'list' ? 1 : 'initial',
  justifyContent: 'space-between'
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease',
  zIndex: 2,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  }
}));

const CategoryBadge = styled(Chip)(({ theme, color }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  left: theme.spacing(1.5),
  fontSize: '0.75rem',
  height: '24px',
  backgroundColor: color || theme.palette.primary.main,
  color: 'white',
  fontWeight: 500,
  zIndex: 1,
  boxShadow: theme.shadows[2],
}));

const SortButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  padding: theme.spacing(1, 2),
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
}));

const ViewToggleButton = styled(IconButton)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : theme.palette.background.paper,
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  marginLeft: theme.spacing(1),
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  }
}));

const ActiveFilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  '& .MuiChip-deleteIcon': {
    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600],
    '&:hover': {
      color: theme.palette.error.main,
    }
  }
}));

const PageBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: 'calc(100vh - 100px)',
  padding: theme.spacing(3, 0),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(180deg, #1a202c 0%, #171923 100%)' 
    : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: theme.palette.mode === 'dark'
      ? 'radial-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px)'
      : 'radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
    zIndex: 1,
  }
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const NoResultsContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.7)',
  borderRadius: '24px',
  border: `1px dashed ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
    : '0 8px 32px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(8px)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 50%)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0) 50%)',
    pointerEvents: 'none',
  }
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 2,
}));

// Mobile filter drawer implementation with improved styling
const FilterDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '85%',
    maxWidth: '320px',
    padding: 0,
    boxSizing: 'border-box',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.97), rgba(15, 23, 42, 0.97))' 
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.97), rgba(249, 250, 251, 0.97))',
    backdropFilter: 'blur(15px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 0 40px 0 rgba(0, 0, 0, 0.6)'
      : '0 0 40px 0 rgba(0, 0, 0, 0.15)'
  }
}));

// Product skeleton component for loading state
const ProductSkeleton = ({ view }) => {
  const theme = useTheme();
  
  if (view === 'grid') {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          borderRadius: '16px', 
          overflow: 'hidden',
          height: '100%',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Skeleton variant="rectangular" height={200} animation="wave" />
        <Box sx={{ p: 2 }}>
          <Skeleton animation="wave" height={24} width="80%" sx={{ mb: 1 }} />
          <Skeleton animation="wave" height={20} width="50%" sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
            <Skeleton animation="wave" height={28} width="40%" />
            <Skeleton animation="wave" height={35} width="35%" variant="circular" />
          </Box>
        </Box>
      </Paper>
    );
  }
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: '16px', 
        overflow: 'hidden',
        display: 'flex',
        height: '140px',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Skeleton variant="rectangular" width={140} height={140} animation="wave" />
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Skeleton animation="wave" height={24} width="60%" sx={{ mb: 1 }} />
          <Skeleton animation="wave" height={20} width="40%" sx={{ mb: 1 }} />
          <Skeleton animation="wave" height={16} width="70%" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton animation="wave" height={28} width="30%" />
          <Skeleton animation="wave" height={35} width="20%" variant="circular" />
        </Box>
      </Box>
    </Paper>
  );
};

// Get color for category badge
const getCategoryColor = (category) => {
  const colors = {
    'Electronics': '#4caf50',
    'Books': '#2196f3',
    'Clothing': '#9c27b0',
    'Food': '#ff9800',
    'Sports': '#e91e63',
    'Others': '#607d8b'
  };
  return colors[category] || '#9e9e9e';
};

const Products = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [view, setView] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        
        // Extract categories from products for filtering
        const allCategories = response.data.products.map(product => product.category);
        setCategories([...new Set(allCategories)]);
      } catch (error) {
        console.error('Error fetching products:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load products. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term, price range, and selected categories
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, selectedCategories, products]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setSortAnchorEl(null);
    
    let sortedProducts = [...filteredProducts];
    
    switch (option) {
      case 'priceAsc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.ratings.average - a.ratings.average);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sortedProducts);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Add product to cart
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({ open: true, message: 'Please login to add items to cart', severity: 'warning' });
        return;
      }
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSnackbar({ open: true, message: 'Added to cart successfully!', severity: 'success' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };
  
  // Toggle favorite product
  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
    setFavoriteProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    setSnackbar({ 
      open: true, 
      message: favoriteProducts.includes(productId) ? 'Removed from favorites' : 'Added to favorites', 
      severity: 'success' 
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  
  const clearAllFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
  };
  
  const hasActiveFilters = () => {
    return searchTerm || 
           selectedCategories.length > 0 || 
           priceRange[0] > 0 || 
           priceRange[1] < maxPrice;
  };
  
  const renderFilterChips = () => {
    const chips = [];
    
    if (searchTerm) {
      chips.push(
        <ActiveFilterChip
          key="search"
          label={`Search: ${searchTerm}`}
          onDelete={() => setSearchTerm('')}
        />
      );
    }
    
    selectedCategories.forEach(category => {
      chips.push(
        <ActiveFilterChip
          key={category}
          label={`Category: ${category}`}
          onDelete={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
        />
      );
    });
    
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      chips.push(
        <ActiveFilterChip
          key="price"
          label={`Price: ₹${priceRange[0]} - ₹${priceRange[1]}`}
          onDelete={() => setPriceRange([0, maxPrice])}
        />
      );
    }
    
    return chips;
  };
  
  const getSortLabel = () => {
    switch (sortOption) {
      case 'priceAsc': return 'Price: Low to High';
      case 'priceDesc': return 'Price: High to Low';
      case 'rating': return 'Top Rated';
      case 'newest': return 'Newest First';
      default: return 'Sort';
    }
  };
  
  const renderFilters = () => (
    <Box>
      <FilterHeader>
        <Typography variant="h6" fontWeight="700" sx={{ 
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #60a5fa, #818cf8)'
            : 'linear-gradient(45deg, #4f46e5, #6366f1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Filters
        </Typography>
        {hasActiveFilters() && (
          <Button 
            size="small" 
            startIcon={<HighlightOff sx={{ fontSize: '1.1rem' }} />} 
            onClick={clearAllFilters}
            sx={{ 
              fontWeight: 600, 
              fontSize: '0.8rem', 
              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              '&:hover': {
                color: theme.palette.error.main,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(239, 68, 68, 0.05)',
              }
            }}
          >
            Clear All
          </Button>
        )}
      </FilterHeader>
      <FilterBody>
        <SearchField
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ 
                  color: searchTerm ? theme.palette.primary.main : 'text.secondary',
                  transition: 'color 0.3s'
                }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => setSearchTerm('')}
                  sx={{ color: 'text.secondary' }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <FilterSection>
          <FilterSectionTitle>
            <LocalOffer />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, m: 0, fontSize: '0.95rem' }}>
              Categories
            </Typography>
          </FilterSectionTitle>
          <FormGroup>
            {categories.map(category => (
              <CategoryLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...selectedCategories, category]
                        : selectedCategories.filter(c => c !== category);
                      setSelectedCategories(newCategories);
                    }}
                    color="primary"
                    size="small"
                    sx={{
                      '&.Mui-checked': {
                        color: getCategoryColor(category),
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.1rem',
                      }
                    }}
                    icon={
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                        borderRadius: '4px',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                      }} />
                    }
                  />
                }
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    opacity: selectedCategories.length > 0 && !selectedCategories.includes(category) ? 0.6 : 1,
                    transition: 'opacity 0.2s, transform 0.2s',
                    transform: selectedCategories.includes(category) ? 'translateX(3px)' : 'none',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: getCategoryColor(category),
                          mr: 1,
                          display: selectedCategories.includes(category) ? 'block' : 'none',
                          boxShadow: `0 0 5px ${getCategoryColor(category)}`,
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: selectedCategories.includes(category) ? 600 : 400,
                          transition: 'font-weight 0.2s',
                        }}
                      >
                        {category}
                      </Typography>
                    </Box>
                    <Chip 
                      size="small" 
                      label={products.filter(p => p.category === category).length || '0'} 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem', 
                        bgcolor: `${getCategoryColor(category)}20`,
                        color: getCategoryColor(category),
                        fontWeight: 600,
                        border: `1px solid ${getCategoryColor(category)}40`,
                        transition: 'transform 0.2s, opacity 0.2s',
                        transform: selectedCategories.includes(category) ? 'scale(1.1)' : 'none',
                        opacity: selectedCategories.includes(category) ? 1 : 0.8,
                      }} 
                    />
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            <AttachMoney />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, m: 0, fontSize: '0.95rem' }}>
              Price Range
            </Typography>
          </FilterSectionTitle>
          
          <PriceRangeBox>
            <Box sx={{ px: 1, pt: 0.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                ₹{priceRange[0]}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.1)',
                }}
              >
                Range: ₹{priceRange[1] - priceRange[0]}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                ₹{priceRange[1]}
              </Typography>
            </Box>
            
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              valueLabelFormat={(value) => `₹${value}`}
              sx={{
                color: 'primary.main',
                height: 6,
                '& .MuiSlider-thumb': {
                  width: 18,
                  height: 18,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)'
                  }
                },
                '& .MuiSlider-track': {
                  height: 6,
                  borderRadius: 3,
                  backgroundImage: 'linear-gradient(90deg, #4f46e5, #6366f1)',
                },
                '& .MuiSlider-rail': {
                  height: 6,
                  borderRadius: 3,
                  opacity: 0.3,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                },
                mx: 1,
                mt: 0.5,
              }}
            />
          </PriceRangeBox>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 2,
            gap: 2
          }}>
            <PriceField
              size="small"
              label="Min"
              value={priceRange[0]}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value) || 0);
                setPriceRange(prev => [value, prev[1]]);
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{ width: '50%' }}
            />
            <PriceField
              size="small"
              label="Max"
              value={priceRange[1]}
              onChange={(e) => {
                const value = Math.min(maxPrice, parseInt(e.target.value) || 0);
                setPriceRange(prev => [prev[0], value]);
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{ width: '50%' }}
            />
          </Box>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            <Star />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, m: 0, fontSize: '0.95rem' }}>
              Minimum Rating
            </Typography>
          </FilterSectionTitle>
          <RatingBox>
            <Rating
              value={filters.minRating}
              onChange={(e, newValue) => setFilters(prev => ({
                ...prev,
                minRating: newValue
              }))}
              precision={0.5}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: theme.palette.warning.main,
                  filter: 'drop-shadow(0 0 2px rgba(255, 167, 38, 0.5))',
                },
                '& .MuiRating-iconEmpty': {
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
                },
                fontSize: '1.8rem',
              }}
            />
            <Box 
              sx={{ 
                mt: 1.5,
                py: 0.5,
                px: 1.5,
                borderRadius: '12px',
                backgroundColor: filters.minRating > 0 
                  ? theme.palette.mode === 'dark' 
                    ? 'rgba(255, 167, 38, 0.15)' 
                    : 'rgba(255, 167, 38, 0.1)'
                  : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: filters.minRating > 0 ? theme.palette.warning.main : 'text.secondary',
                  fontWeight: filters.minRating > 0 ? 600 : 400,
                  transition: 'all 0.3s',
                }}
              >
                {filters.minRating > 0 
                  ? `${filters.minRating}+ Stars` 
                  : "Any Rating"}
              </Typography>
            </Box>
          </RatingBox>
        </FilterSection>
        
        {hasActiveFilters() && (
          <ResetButton
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<FilterList />}
            onClick={clearAllFilters}
            sx={{ mt: 3.5 }}
          >
            Reset All Filters
          </ResetButton>
        )}
      </FilterBody>
    </Box>
  );
  
  // Generate skeletons when loading
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <Grid item key={`skeleton-${index}`} xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12}>
        <ProductSkeleton view={viewMode} />
      </Grid>
    ));
  };

  const renderEmptyState = () => (
    <Grid item xs={12}>
      <NoResultsContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4, opacity: 0.7, position: 'relative' }}>
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <SentimentDissatisfied sx={{ fontSize: 100, color: 'text.secondary', opacity: 0.5 }} />
            </motion.div>
          </Box>
          
          <Typography 
            variant="h5" 
            color="text.primary" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            No products found
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: '60%', mx: 'auto', mb: 4 }}
          >
            We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our other categories.
          </Typography>
          
          {hasActiveFilters() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button 
                variant="contained" 
                onClick={clearAllFilters}
                sx={{ mt: 2 }}
                startIcon={<FilterAlt />}
                size="large"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </NoResultsContainer>
    </Grid>
  );
  
  // Replace the return statement with our new layout
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        pb: 8,
      }}
    >
      {/* Modern Header Section */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          bgcolor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          mb: 4,
          pt: 5,
          pb: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            fontWeight={800}
            sx={{ 
              backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              mb: 1
            }}
          >
            Marketplace
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            fontWeight={400}
            sx={{ mb: 3 }}
          >
            Discover unique items from students across campus
          </Typography>
          
          <Box sx={{ position: 'relative', maxWidth: 600 }}>
            <TextField
              placeholder="Search products..."
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '16px',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  '&:hover': {
                    boxShadow: '0 6px 24px rgba(0,0,0,0.09)'
                  }
                }
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          
          {/* Background Elements */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: -30, 
            right: -30, 
            width: 120, 
            height: 120, 
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            zIndex: 0
          }} />
          <Box sx={{ 
            position: 'absolute', 
            top: -15, 
            left: '5%', 
            width: 60, 
            height: 60, 
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.secondary.main, 0.05),
            zIndex: 0
          }} />
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {filteredProducts.length} Products
            </Typography>
            
            {!isMobile && (
              <>
                <Divider orientation="vertical" flexItem sx={{ height: 20 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {selectedCategories.map((cat) => (
                    <Chip 
                      key={cat}
                      label={cat}
                      onDelete={() => handleCategoryToggle(cat)}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                      }}
                    />
                  ))}
                  
                  {priceRange[0] > 0 || priceRange[1] < maxPrice ? (
                    <Chip 
                      label={`₹${priceRange[0]} - ₹${priceRange[1]}`}
                      onDelete={() => setPriceRange([0, maxPrice])}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                      }}
                    />
                  ) : null}
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Sort />}
              onClick={(e) => setSortAnchorEl(e.currentTarget)}
              sx={{ 
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: alpha(theme.palette.primary.main, 0.3),
              }}
            >
              Sort
            </Button>

            {isMobile && (
              <Button
                variant="outlined"
                startIcon={<FilterAlt />}
                onClick={() => setFilterOpen(true)}
                sx={{ 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                }}
              >
                Filter
              </Button>
            )}

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
              <IconButton 
                color={view === 'grid' ? 'primary' : 'default'}
                onClick={() => setView('grid')}
                sx={{ 
                  bgcolor: view === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  borderRadius: '10px',
                }}
              >
                <GridView />
              </IconButton>
              <IconButton 
                color={view === 'list' ? 'primary' : 'default'}
                onClick={() => setView('list')}
                sx={{ 
                  bgcolor: view === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  borderRadius: '10px',
                }}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Grid container spacing={3}>
          {/* Filters - Desktop View */}
          {!isMobile && (
            <Grid item xs={12} md={3} lg={2.5}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FilterContainer>
                  {renderFilters()}
                </FilterContainer>
              </motion.div>
            </Grid>
          )}

          {/* Product Grid */}
          <Grid item xs={12} md={9} lg={9.5}>
            {loading ? (
              // Loading skeletons...
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: item * 0.05 }}
                    >
                      <Card sx={{ 
                        borderRadius: '16px', 
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: '0 14px 40px rgba(0,0,0,0.12)',
                          transform: 'translateY(-4px)'
                        },
                        transition: 'all 0.3s ease',
                      }}>
                        <Skeleton variant="rectangular" height={180} animation="wave" />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Skeleton variant="text" height={30} width="80%" animation="wave" />
                          <Skeleton variant="text" height={20} width="40%" animation="wave" />
                          <Skeleton variant="text" height={20} width="60%" animation="wave" />
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Skeleton variant="text" height={28} width="30%" animation="wave" />
                            <Skeleton variant="circular" height={36} width={36} animation="wave" />
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredProducts.map((product, index) => (
                      <Grid 
                        item 
                        xs={12} 
                        sm={view === 'grid' ? 6 : 12}
                        md={view === 'grid' ? 4 : 12}
                        lg={view === 'grid' ? 3 : 12} 
                        key={product._id}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <ProductCard
                            view={view}
                            onClick={() => handleProductClick(product._id)}
                            variants={itemVariants}
                          >
                            <CategoryBadge 
                              label={product.category} 
                              size="small"
                              color={getCategoryColor(product.category)}
                            />
                            <ProductImageContainer view={view}>
                              <ProductImage
                                className="product-image"
                                src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={product.name}
                                view={view}
                              />
                            </ProductImageContainer>
                            <ProductInfo view={view}>
                              <Box>
                                <Typography 
                                  variant={view === 'grid' ? 'subtitle1' : 'h6'} 
                                  fontWeight="600"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    mb: 0.5
                                  }}
                                >
                                  {product.name}
                                </Typography>
                                
                                {view === 'list' && (
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      mb: 2
                                    }}
                                  >
                                    {product.description?.slice(0, 120)}
                                    {product.description?.length > 120 ? '...' : ''}
                                  </Typography>
                                )}
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Rating 
                                    value={product.ratings?.average || 0} 
                                    precision={0.5} 
                                    readOnly 
                                    size="small"
                                    sx={{
                                      '& .MuiRating-iconFilled': {
                                        color: theme.palette.warning.main
                                      }
                                    }}
                                  />
                                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    ({product.ratings?.count || 0})
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <Typography variant="h6" color="primary.main" fontWeight="700">
                                  ₹{product.price}
                                </Typography>
                                
                                {user && (
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddShoppingCart />}
                                    onClick={(e) => handleAddToCart(product._id, e)}
                                    sx={{ 
                                      borderRadius: '8px',
                                      boxShadow: 2,
                                      textTransform: 'none',
                                    }}
                                  >
                                    Add
                                  </Button>
                                )}
                              </Box>
                              
                              <ProductActions className="product-actions">
                                <ActionButton
                                  size="small"
                                  onClick={(e) => toggleFavorite(product._id, e)}
                                  color={favoriteProducts.includes(product._id) ? 'primary' : 'default'}
                                >
                                  {favoriteProducts.includes(product._id) ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                                </ActionButton>
                              </ProductActions>
                            </ProductInfo>
                          </ProductCard>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  // No results found state
                  <Box sx={{ 
                    py: 10, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SentimentDissatisfied sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                      No products found
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      Try adjusting your search or filters
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange([0, maxPrice]);
                        setSelectedCategories([]);
                      }}
                      sx={{ 
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3
                      }}
                    >
                      Clear all filters
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            height: 'auto',
            maxHeight: '90vh',
          }
        }}
      >
        {/* Mobile Filter Content */}
        {/* ...existing code... */}
      </Drawer>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            minWidth: 180,
          }
        }}
      >
        {/* Sort options */}
        {/* ...existing code... */}
      </Menu>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
