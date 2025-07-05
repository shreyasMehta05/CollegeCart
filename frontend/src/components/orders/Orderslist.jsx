// src/components/orders/OrdersList.js
import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    delivered: 'success',
    cancelled: 'error'
};

const OrdersList = ({ orders, type, onOrderUpdate }) => {
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [otp, setOtp] = React.useState('');
    const [otpError, setOtpError] = React.useState('');

    const handleOtpSubmit = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/orders/verify`,
                {
                    orderId: selectedOrder._id,
                    otp
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            toast.success('Order verified successfully!');
            onOrderUpdate();
            handleClose();
        } catch (error) {
            setOtpError(error.response?.data?.message || 'Invalid OTP');
        }
    };

    const handleClose = () => {
        setSelectedOrder(null);
        setOtp('');
        setOtpError('');
    };

    return (
        <>
            <List>
                {orders.map((order) => (
                    <ListItem
                        key={order._id}
                        sx={{
                            mb: 2,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Order #{order._id.slice(-6)}
                            </Typography>
                            <Chip
                                label={order.status}
                                color={statusColors[order.status]}
                                size="small"
                            />
                        </Box>

                        {order.items.map((item) => (
                            <Box
                                key={item._id}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1
                                }}
                            >
                                <ListItemText
                                    primary={item.product.name}
                                    secondary={`Quantity: ${item.quantity} | Price: ₹${item.price}`}
                                />
                                <Typography variant="body2">
                                    {type === 'buying' 
                                        ? `Seller: ${item.seller.firstName} ${item.seller.lastName}`
                                        : `Buyer: ${order.buyer.firstName} ${order.buyer.lastName}`}
                                </Typography>
                            </Box>
                        ))}

                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Total: ₹{order.totalAmount}
                            </Typography>
                            {type === 'selling' && order.status === 'pending' && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    Verify OTP
                                </Button>
                            )}
                            {type === 'buying' && order.status === 'pending' && (
                                <Typography variant="body2" color="primary">
                                    OTP: {order.otp}
                                </Typography>
                            )}
                        </Box>
                    </ListItem>
                ))}
            </List>

            <Dialog open={Boolean(selectedOrder)} onClose={handleClose}>
                <DialogTitle>Verify Order OTP</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Enter OTP"
                        type="text"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        error={Boolean(otpError)}
                        helperText={otpError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleOtpSubmit} variant="contained">
                        Verify
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrdersList;