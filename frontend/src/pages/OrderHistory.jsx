import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Tabs,
    Tab,
    Box,
    Grid,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { 
    Refresh as RefreshIcon, 
    ContentCopy as CopyIcon, 
    Sort as SortIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderHistory = () => {
    const [tab, setTab] = useState(0);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otpGenerationDialog, setOtpGenerationDialog] = useState({ 
        open: false, 
        orderId: null 
    });
    const [sortDialog, setSortDialog] = useState(false);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchOrders();
    }, [tab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let response;
            if (tab === 0 || tab === 1) {
                response = await axios.get('http://localhost:5000/api/orders/buyer', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const allBuyerOrders = Array.isArray(response.data.orders) ? response.data.orders : [];
                
                if (tab === 0) {
                    const pendingOrders = allBuyerOrders.filter(order => order.status === 'pending');
                    setOrders(sortOrders(pendingOrders));
                } else {
                    const processedOrders = allBuyerOrders.filter(order => order.status !== 'pending');
                    setOrders(sortOrders(processedOrders));
                }
            } else if (tab === 2) {
                response = await axios.get('http://localhost:5000/api/orders/seller', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setOrders(sortOrders(Array.isArray(response.data.orders) ? response.data.orders : []));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error fetching orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const generateNewOTP = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/orders/generate-otp', {
                orderId: otpGenerationDialog.orderId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            toast.success(response.data.message || 'New OTP generated successfully!');
            setOtpGenerationDialog({ open: false, orderId: null });
            fetchOrders();
        } catch (error) {
            console.error('Error generating OTP:', error);
            toast.error(error.response?.data?.message || 'Error generating OTP');
        }
    };

    const handleCopyOTP = (otp) => {
        navigator.clipboard.writeText(otp).then(() => {
            toast.success('OTP copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy OTP:', err);
            toast.error('Failed to copy OTP');
        });
    };

    const sortOrders = (ordersToSort) => {
        return [...ordersToSort].sort((a, b) => {
            switch (sortField) {
                case 'date':
                    return sortOrder === 'desc' 
                        ? new Date(b.createdAt) - new Date(a.createdAt)
                        : new Date(a.createdAt) - new Date(b.createdAt);
                case 'amount':
                    return sortOrder === 'desc' 
                        ? b.totalAmount - a.totalAmount
                        : a.totalAmount - b.totalAmount;
                default:
                    return 0;
            }
        });
    };

    const handleSort = () => {
        const sortedOrders = sortOrders(orders);
        setOrders(sortedOrders);
        setSortDialog(false);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            confirmed: 'info',
            delivered: 'success',
            cancelled: 'error'
        };
        return colors[status] || 'default';
    };

    // Sort dialog JSX
    const sortDialogJSX = (
        <Dialog open={sortDialog} onClose={() => setSortDialog(false)}>
            <DialogTitle>Sort Orders</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortField}
                        label="Sort By"
                        onChange={(e) => setSortField(e.target.value)}
                    >
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="amount">Amount</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Order</InputLabel>
                    <Select
                        value={sortOrder}
                        label="Order"
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSortDialog(false)}>Cancel</Button>
                <Button onClick={handleSort} variant="contained">Apply</Button>
            </DialogActions>
        </Dialog>
    );

    // Sort button JSX
    const sortButtonJSX = (
        <Tooltip title="Sort Orders">
            <IconButton onClick={() => setSortDialog(true)} color="primary" sx={{ ml: 1 }}>
                <SortIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Order History</Typography>
                <Box>
                    {sortButtonJSX}
                    <Tooltip title="Refresh Orders">
                        <IconButton onClick={fetchOrders} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Tabs 
                value={tab} 
                onChange={(e, newValue) => setTab(newValue)} 
                sx={{ mb: 3 }}
                variant="fullWidth"
            >
                <Tab label="Pending Orders" />
                <Tab label="Purchases" />
                <Tab label="Sales" />
            </Tabs>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : orders.length === 0 ? (
                <Typography textAlign="center" sx={{ mt: 4 }}>
                    No orders found in this category.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => (
                        <Grid item xs={12} key={order._id}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">
                                        Order #{order._id.substring(0, 8)}
                                    </Typography>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                        variant="outlined"
                                    />
                                </Box>

                                {order.items.map((item) => (
                                    <Box key={item._id} sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        mb: 1,
                                        py: 1,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <Box>
                                            <Typography variant="body1">
                                                {item?.product?.name || 'Unknown Product'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Quantity: {item.quantity}
                                            </Typography>
                                        </Box>
                                        <Typography color="primary" variant="subtitle1">
                                            ₹{item.price * item.quantity}
                                        </Typography>
                                    </Box>
                                ))}

                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    mt: 2 
                                }}>
                                    <Typography variant="h6">
                                        Total: ₹{order.totalAmount}
                                    </Typography>

                                    {tab === 0 && order.status === 'pending' && order.otp && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{ mr: 2 }}
                                            >
                                                OTP: {order.otpUnhashed}
                                            </Typography>
                                            <Tooltip title="Copy OTP">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleCopyOTP(order.otpUnhashed)}
                                                >
                                                    <CopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ ml: 1 }}
                                                onClick={() => setOtpGenerationDialog({ 
                                                    open: true, 
                                                    orderId: order._id 
                                                })}
                                            >
                                                Generate New OTP
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {sortDialogJSX}

            <Dialog 
                open={otpGenerationDialog.open} 
                onClose={() => setOtpGenerationDialog({ open: false, orderId: null })}
            >
                <DialogTitle>Generate New OTP</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to generate a new OTP for this order? 
                        The previous OTP will be invalidated.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOtpGenerationDialog({ open: false, orderId: null })}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={generateNewOTP} 
                        variant="contained"
                        color="primary"
                    >
                        Generate OTP
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OrderHistory;
