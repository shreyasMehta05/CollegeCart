import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Chip
} from '@mui/material';
import { LocalShipping, AccessTime, School, DoorFront } from '@mui/icons-material';
import axios from 'axios';


const OTPDialog = ({ open, onClose, onSubmit }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!otp) {
            setError('Please enter OTP');
            return;
        }
        onSubmit(otp);
        setOtp(''); // Reset OTP field after submission
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Enter Delivery OTP</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Please ask the buyer for their 6-digit OTP to complete the delivery
                </Typography>
                <TextField
                    fullWidth
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={!!error}
                    helperText={error}
                    margin="normal"
                    placeholder="Enter 6-digit OTP"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Verify & Complete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const DeliveryCard = ({ delivery, onCompleteDelivery }) => {
    return (
        <Card elevation={3} sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">
                        Order #{delivery.transactionId.substring(0, 8)}
                    </Typography>
                    <Chip
                        icon={<AccessTime />}
                        label={new Date(delivery.orderDate).toLocaleDateString()}
                        color="primary"
                        variant="outlined"
                        size="small"
                    />
                </Box>

                {/* Buyer Details */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong>Buyer:</strong> {delivery.buyer.email}
                </Typography>

                {/* Delivery Address */}
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Delivery Address:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip
                            icon={<School />}
                            label={`Hostel: ${delivery.deliveryAddress.hostel}`}
                            size="small"
                        />
                        <Chip
                            icon={<DoorFront />}
                            label={`Room: ${delivery.deliveryAddress.roomNumber}`}
                            size="small"
                        />
                    </Box>
                </Box>

                {/* Items */}
                <Typography variant="subtitle2" color="text.secondary">
                    Items to Deliver:
                </Typography>
                {delivery.items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            p: 2,
                            mt: 1,
                            mb: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="subtitle1">
                            {item.product.name}
                        </Typography>
                        <Typography color="primary">
                            ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </Typography>
                    </Box>
                ))}

                {/* Delivery Notes if any */}
                {delivery.deliveryNotes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        <strong>Notes:</strong> {delivery.deliveryNotes}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    startIcon={<LocalShipping />}
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => onCompleteDelivery(delivery.orderId)}
                >
                    Complete Delivery
                </Button>
            </CardContent>
        </Card>
    );
};

const DeliveryItems = () => {
    const [pendingDeliveries, setPendingDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [otpDialog, setOtpDialog] = useState({ open: false, orderId: null });

    const fetchPendingDeliveries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders/pending-deliveries', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPendingDeliveries(response.data.deliveries || []);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching pending deliveries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDeliveries();
    }, []);

    const handleCompleteDelivery = async (otp) => {
        try {
            const orderId = otpDialog.orderId;
            await axios.post(
                `http://localhost:5000/api/orders/complete-delivery`, // Corrected URL
                {
                    orderId: otpDialog.orderId,
                    otp
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setOtpDialog({ open: false, orderId: null });            
            fetchPendingDeliveries();
        } catch (error) {
            setError(error.response?.data?.message || 'Error completing delivery');
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Pending Deliveries
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {pendingDeliveries.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No pending deliveries
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {pendingDeliveries.map((delivery) => (
                        <Grid item xs={12} md={6} key={delivery.orderId}>
                            <DeliveryCard
                                delivery={delivery}
                                onCompleteDelivery={(orderId) =>
                                    setOtpDialog({ open: true, orderId })
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <OTPDialog
                open={otpDialog.open}
                onClose={() => setOtpDialog({ open: false, orderId: null })}
                onSubmit={handleCompleteDelivery}
            />
        </Container>
    );
};

export default DeliveryItems;