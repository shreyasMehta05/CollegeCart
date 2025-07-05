import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Chip,
    Avatar,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Badge,
    Divider,
    useTheme,
    alpha,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import { 
    Add, 
    Edit, 
    Delete, 
    LocalShipping, 
    SearchOutlined,
    NotificationsOutlined,
    BarChart,
    Store,
    AttachMoney,
    Visibility,
    CreditCard,
    ShoppingBag,
    TrendingUp,
    Close
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { motion } from 'framer-motion';

// Delete confirmation dialog component
const DeleteProductDialog = ({ open, onClose, onConfirm, productName }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                style: {
                    borderRadius: 16,
                    padding: 8
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
                Delete Product
            </DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete <strong>{productName}</strong>?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button 
                    onClick={onClose}
                    variant="outlined" 
                    sx={{ 
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="error" 
                    variant="contained"
                    sx={{ 
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const SellerDashboard = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalSales: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
    const [formDialog, setFormDialog] = useState({ open: false, type: null, product: null });
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for notifications and analytics menus
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [analyticsAnchor, setAnalyticsAnchor] = useState(null);
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New order received', time: '10 minutes ago', read: false },
        { id: 2, message: 'Product review added', time: '2 hours ago', read: false },
        { id: 3, message: 'Payment confirmed', time: '1 day ago', read: true }
    ]);

    useEffect(() => {
        fetchSellerData();
    }, [retryCount]);

    const fetchSellerData = async () => {
        try {
            const [productsRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/products/seller', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                axios.get('http://localhost:5000/api/orders/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);
            setProducts(productsRes.data.products);
            setStats(statsRes.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching seller data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (formData) => {
        try {
            await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchSellerData();
            setFormDialog({ open: false, type: null, product: null });
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error adding product');
        }
    };

    const handleUpdateProduct = async (formData) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${formDialog.product._id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchSellerData();
            setFormDialog({ open: false, type: null, product: null });
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error updating product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchSellerData();
        } catch (error) {
            setError(error.response?.data?.message || 'Error deleting product');
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setError('');
        setRetryCount(prev => prev + 1);
    };

    const filteredProducts = searchQuery.trim() 
        ? products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

    const handleNotificationClick = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    const handleAnalyticsClick = (event) => {
        setAnalyticsAnchor(event.currentTarget);
    };

    const handleAnalyticsClose = () => {
        setAnalyticsAnchor(null);
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(notification => ({
            ...notification,
            read: true
        })));
        handleNotificationClose();
    };

    const handleNotificationRead = (id) => {
        setNotifications(prev => prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const unreadCount = notifications.filter(notification => !notification.read).length;

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                height: '100vh', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 3,
                backgroundColor: '#f8fafc'
            }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="text.secondary">
                    Loading your dashboard...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            bgcolor: '#f8fafc',
            pb: 8
        }}>
            {/* Header */}
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
                    pb: 6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg">
                    {/* Top navigation actions */}
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mb: 4
                    }}>
                        <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 3,
                            px: 2,
                            py: 0.5,
                            width: 220
                        }}>
                            <SearchOutlined sx={{ color: 'text.secondary', mr: 1 }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ 
                                    border: 'none', 
                                    outline: 'none',
                                    background: 'transparent',
                                    width: '100%',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </Box>
                        <Tooltip title="Notifications">
                            <IconButton 
                                sx={{ 
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                }}
                                onClick={handleNotificationClick}
                            >
                                <Badge badgeContent={unreadCount} color="error">
                                    <NotificationsOutlined />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Analytics">
                            <IconButton 
                                sx={{ 
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                }}
                                onClick={handleAnalyticsClick}
                            >
                                <BarChart />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    
                    {/* Notifications Menu */}
                    <Menu
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={handleNotificationClose}
                        PaperProps={{
                            sx: { 
                                width: 320, 
                                maxWidth: '90vw',
                                borderRadius: 2,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                mt: 1.5
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ 
                            p: 2, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="h6" fontWeight={600}>Notifications</Typography>
                            <Button 
                                size="small" 
                                onClick={handleMarkAllRead}
                                sx={{ 
                                    textTransform: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Mark all as read
                            </Button>
                        </Box>
                        {notifications.length > 0 ? (
                            <List sx={{ p: 0 }}>
                                {notifications.map((notification) => (
                                    <ListItem 
                                        key={notification.id} 
                                        onClick={() => handleNotificationRead(notification.id)}
                                        sx={{ 
                                            p: 2, 
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                                            },
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <ListItemText 
                                            primary={notification.message} 
                                            secondary={notification.time} 
                                            primaryTypographyProps={{
                                                fontWeight: notification.read ? 400 : 600
                                            }}
                                        />
                                        {!notification.read && (
                                            <Box 
                                                sx={{ 
                                                    width: 8, 
                                                    height: 8, 
                                                    bgcolor: 'primary.main', 
                                                    borderRadius: '50%' 
                                                }} 
                                            />
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography color="text.secondary">No notifications</Typography>
                            </Box>
                        )}
                    </Menu>

                    {/* Analytics Menu */}
                    <Menu
                        anchorEl={analyticsAnchor}
                        open={Boolean(analyticsAnchor)}
                        onClose={handleAnalyticsClose}
                        PaperProps={{
                            sx: { 
                                width: 280, 
                                maxWidth: '90vw',
                                borderRadius: 2,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                mt: 1.5
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ 
                            p: 2, 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="h6" fontWeight={600}>Analytics</Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                            <ListItem 
                                onClick={handleAnalyticsClose}
                                sx={{ 
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                                    cursor: 'pointer'
                                }}
                            >
                                <ListItemIcon>
                                    <TrendingUp color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Sales Overview" />
                            </ListItem>
                            <ListItem 
                                onClick={handleAnalyticsClose}
                                sx={{ 
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                                    cursor: 'pointer'
                                }}
                            >
                                <ListItemIcon>
                                    <ShoppingBag color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Product Performance" />
                            </ListItem>
                            <ListItem 
                                onClick={handleAnalyticsClose}
                                sx={{ 
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                                    cursor: 'pointer'
                                }}
                                component={Link}
                                to="/transaction-history"
                            >
                                <ListItemIcon>
                                    <CreditCard color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Transaction History" />
                            </ListItem>
                        </List>
                    </Menu>
                    
                    {/* Welcome section */}
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Box>
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
                                    Welcome back, {user?.firstName || 'Seller'}!
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    color="text.secondary"
                                    fontWeight={400}
                                >
                                    Manage your inventory and track your sales performance on IIIT Marketplace
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => setFormDialog({ open: true, type: 'add', product: null })}
                                        sx={{ 
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            py: 1.2,
                                            px: 3,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                                        }}
                                    >
                                        Add New Product
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to="/pending-deliveries"
                                        startIcon={<LocalShipping />}
                                        sx={{ 
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            py: 1.2,
                                            px: 3,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderWidth: 2
                                        }}
                                    >
                                        Pending Deliveries
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box sx={{ 
                                position: 'relative',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {/* Created SVG illustration instead of using external image */}
                                <Box
                                    component="svg"
                                    viewBox="0 0 500 300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    sx={{
                                        width: '90%', 
                                        maxHeight: 220,
                                    }}
                                >
                                    {/* Background elements */}
                                    <circle cx="250" cy="150" r="130" fill="#f0f4ff" />
                                    
                                    {/* Store building */}
                                    <rect x="150" y="120" width="200" height="130" rx="8" fill="#6366F1" />
                                    <rect x="160" y="130" width="180" height="120" rx="4" fill="white" />
                                    
                                    {/* Store roof */}
                                    <polygon points="150,120 250,70 350,120" fill="#8B5CF6" />
                                    
                                    {/* Door */}
                                    <rect x="230" y="180" width="40" height="70" rx="4" fill="#6366F1" />
                                    <circle cx="260" cy="210" r="4" fill="gold" />
                                    
                                    {/* Windows */}
                                    <rect x="180" y="150" width="30" height="30" rx="2" fill="#e0e7ff" stroke="#6366F1" />
                                    <rect x="290" y="150" width="30" height="30" rx="2" fill="#e0e7ff" stroke="#6366F1" />
                                    
                                    {/* Shopping elements */}
                                    <circle cx="140" cy="230" r="20" fill="#ED8936" />
                                    <rect x="130" y="210" width="20" height="5" fill="#6366F1" />
                                    
                                    <circle cx="370" cy="230" r="25" fill="#38B2AC" />
                                    <polygon points="360,215 380,215 370,200" fill="#6366F1" />
                                    
                                    {/* Text or sign */}
                                    <rect x="190" y="100" width="120" height="30" rx="15" fill="#8B5CF6" />
                                    <text x="250" y="120" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">IIIT Shop</text>
                                    
                                    {/* Additional decorative elements */}
                                    <circle cx="400" cy="100" r="15" fill="#ED8936" opacity="0.7" />
                                    <circle cx="100" cy="150" r="10" fill="#38B2AC" opacity="0.7" />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Abstract shapes for decoration */}
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
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '40%', 
                        right: '15%', 
                        width: 25, 
                        height: 25, 
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        zIndex: 0
                    }} />
                </Container>
            </Box>

            {/* Stats Cards */}
            <Container maxWidth="lg">
                <Grid 
                    container 
                    spacing={3} 
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    sx={{ mb: 5, justifyContent: 'center' }}
                >
                    <Grid item xs={12} sm={6} md={4} lg={3.5}>
                        <Card sx={{ 
                            borderRadius: 4,
                            height: '100%',
                            p: 0.5,
                            background: 'linear-gradient(135deg, #3182CE 0%, #2B6CB0 100%)', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-5px)'
                            }
                        }}>
                            <Box sx={{ 
                                bgcolor: 'white', 
                                borderRadius: 3.5,
                                height: '100%',
                                p: 3
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography color="text.secondary" fontWeight={500} variant="body2" gutterBottom>
                                            Total Products
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700} gutterBottom>
                                            {stats.totalProducts}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Products in your inventory
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ 
                                        bgcolor: 'rgba(49, 130, 206, 0.1)', 
                                        color: '#3182CE',
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3
                                    }}>
                                        <Store fontSize="large" />
                                    </Avatar>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4} lg={3.5}>
                        <Card sx={{ 
                            borderRadius: 4,
                            height: '100%',
                            p: 0.5,
                            background: 'linear-gradient(135deg, #38B2AC 0%, #319795 100%)', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-5px)'
                            }
                        }}>
                            <Box sx={{ 
                                bgcolor: 'white', 
                                borderRadius: 3.5,
                                height: '100%',
                                p: 3
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography color="text.secondary" fontWeight={500} variant="body2" gutterBottom>
                                            Total Sales
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700} gutterBottom>
                                            {stats.totalSales}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Products sold to date
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ 
                                        bgcolor: 'rgba(56, 178, 172, 0.1)', 
                                        color: '#38B2AC',
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3
                                    }}>
                                        <BarChart fontSize="large" />
                                    </Avatar>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4} lg={3.5}>
                        <Card sx={{ 
                            borderRadius: 4,
                            height: '100%',
                            p: 0.5,
                            background: 'linear-gradient(135deg, #ED8936 0%, #DD6B20 100%)', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-5px)'
                            }
                        }}>
                            <Box sx={{ 
                                bgcolor: 'white', 
                                borderRadius: 3.5,
                                height: '100%',
                                p: 3
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography color="text.secondary" fontWeight={500} variant="body2" gutterBottom>
                                            Total Revenue
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700} gutterBottom>
                                            ₹{stats.totalRevenue}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total earnings from sales
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ 
                                        bgcolor: 'rgba(237, 137, 54, 0.1)', 
                                        color: '#ED8936',
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3
                                    }}>
                                        <AttachMoney fontSize="large" />
                                    </Avatar>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                {/* Product List Section */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 4
                    }}>
                        <Typography variant="h5" fontWeight={700}>
                            My Products ({filteredProducts.length})
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {searchQuery && (
                                <Chip 
                                    label={`Search: ${searchQuery}`} 
                                    onDelete={() => setSearchQuery('')} 
                                    sx={{ borderRadius: 3 }} 
                                />
                            )}
                        </Box>
                    </Box>

                    {error && (
                        <Box 
                            sx={{ 
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                color: 'error.main',
                                p: 2,
                                borderRadius: 3,
                                mb: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Typography>{error}</Typography>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={handleRetry}
                                sx={{ 
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Retry
                            </Button>
                        </Box>
                    )}

                    <Grid container spacing={3}>
                        {filteredProducts && filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    sm={6} 
                                    md={4} 
                                    key={product._id}
                                    component={motion.div}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <Card sx={{ 
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'box-shadow 0.3s',
                                        '&:hover': {
                                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                                        }
                                    }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={product.images?.[0] || 'https://via.placeholder.com/300x180?text=No+Image'}
                                                alt={product.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <Box sx={{ 
                                                position: 'absolute',
                                                top: 12,
                                                left: 12,
                                            }}>
                                                <Chip 
                                                    label={product.category} 
                                                    size="small"
                                                    sx={{ 
                                                        borderRadius: 3,
                                                        bgcolor: alpha('#ffffff', 0.85),
                                                        fontWeight: 500,
                                                        backdropFilter: 'blur(4px)'
                                                    }} 
                                                />
                                            </Box>
                                            <Box sx={{ 
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                            }}>
                                                <Chip 
                                                    label={product.status}
                                                    size="small"
                                                    color={
                                                        product.status === 'available' ? 'success' : 
                                                        product.status === 'sold' ? 'error' : 'warning'
                                                    }
                                                    sx={{ 
                                                        borderRadius: 3,
                                                        fontWeight: 500,
                                                        backdropFilter: 'blur(4px)'
                                                    }} 
                                                />
                                            </Box>
                                        </Box>
                                        
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    mb: 1,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start'
                                                }}
                                            >
                                                <span style={{ maxWidth: '80%' }}>
                                                    {product.name}
                                                </span>
                                                <Typography 
                                                    component="span" 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 700, 
                                                        color: 'primary.main' 
                                                    }}
                                                >
                                                    ₹{product.price}
                                                </Typography>
                                            </Typography>
                                            
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    mb: 2,
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    textOverflow: 'ellipsis',
                                                    height: 60
                                                }}
                                            >
                                                {product.description}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Chip 
                                                        label={product.condition} 
                                                        size="small"
                                                        color={
                                                            product.condition === 'New' ? 'primary' : 
                                                            product.condition === 'Like New' ? 'success' : 
                                                            product.condition === 'Good' ? 'info' : 'warning'
                                                        }
                                                        sx={{ 
                                                            borderRadius: 3,
                                                            mr: 1
                                                        }} 
                                                    />
                                                    <Tooltip title="Views">
                                                        <Chip
                                                            icon={<Visibility sx={{ fontSize: 16 }} />}
                                                            label={product.views || 0}
                                                            size="small"
                                                            sx={{ 
                                                                borderRadius: 3,
                                                                bgcolor: alpha(theme.palette.grey[500], 0.2),
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Edit Product">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => setFormDialog({ open: true, type: 'edit', product })}
                                                            sx={{ 
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } 
                                                            }}
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Product">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => setDeleteDialog({ open: true, product })}
                                                            sx={{ 
                                                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } 
                                                            }}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    bgcolor: 'white', 
                                    borderRadius: 4,
                                    p: 4,
                                    textAlign: 'center',
                                    border: '1px dashed',
                                    borderColor: 'divider'
                                }}>
                                    <Box 
                                        component="img"
                                        src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-4816550-4004141.png"
                                        alt="No Products"
                                        sx={{ width: 200, height: 'auto', mb: 3, opacity: 0.8 }}
                                    />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        {searchQuery 
                                            ? 'No products match your search' 
                                            : 'You don\'t have any products yet'}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => setFormDialog({ open: true, type: 'add', product: null })}
                                        sx={{ 
                                            mt: 2,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3
                                        }}
                                    >
                                        Add Your First Product
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Container>

            {/* Product Form Dialog */}
            <Dialog 
                open={formDialog.open} 
                onClose={() => setFormDialog({ open: false, type: null, product: null })}
                maxWidth="md"
                fullWidth
                PaperProps={{ 
                    sx: { 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        m: { xs: 2, sm: 4 }
                    } 
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" fontWeight={700} sx={{ pl: 1 }}>
                        {formDialog.type === 'add' ? 'Add New Product' : 'Edit Product'}
                    </Typography>
                    <IconButton onClick={() => setFormDialog({ open: false, type: null, product: null })}>
                        <Close />
                    </IconButton>
                </Box>
                <DialogContent sx={{ p: 0 }}>
                    <ProductForm
                        initialData={formDialog.type === 'edit' ? formDialog.product : null}
                        onSubmit={formDialog.type === 'add' ? handleAddProduct : handleUpdateProduct}
                        onCancel={() => setFormDialog({ open: false, type: null, product: null })}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <DeleteProductDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, product: null })}
                onConfirm={() => {
                    handleDeleteProduct(deleteDialog.product._id);
                    setDeleteDialog({ open: false, product: null });
                }}
                productName={deleteDialog.product?.name}
            />
        </Box>
    );
};

export default SellerDashboard;