import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    IconButton,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Add, Edit, Delete, TrendingUp, Store, AttachMoney, LocalShipping } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';

// DeleteProductDialog component remains the same
const DeleteProductDialog = ({ open, onClose, onConfirm, productName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete the product "{productName}"?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const SellerDashboard = () => {
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Stats Cards section remains the same */}
            <Grid container spacing={3}>
                {/* ... Your existing stats cards code ... */}
                {/* Stats Cards */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Store sx={{ mr: 2 }} />
                                <Typography variant="h6">Total Products</Typography>
                            </Box>
                            <Typography variant="h4">{stats.totalProducts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TrendingUp sx={{ mr: 2 }} />
                                <Typography variant="h6">Total Sales</Typography>
                            </Box>
                            <Typography variant="h4">{stats.totalSales}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachMoney sx={{ mr: 2 }} />
                                <Typography variant="h6">Total Revenue</Typography>
                            </Box>
                            <Typography variant="h4">₹{stats.totalRevenue}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Products List */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">My Products</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => setFormDialog({ open: true, type: 'add', product: null })}
                                >
                                    Add Product
                                </Button>
                                <Button
                                    component={Link}
                                    to="/pending-deliveries"
                                    startIcon={<LocalShipping />}
                                    variant="contained"
                                >
                                    Pending Deliveries
                                </Button>
                            </Box>
                        </Box>

                        {error && (
                            <>
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                                <Button variant="contained" onClick={handleRetry}>Retry</Button>
                            </>
                        )}

                        <Grid container spacing={2}>
                            {products && products.length > 0 ? (
                                products.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{product.name}</Typography>
                                                <Typography color="primary">₹{product.price}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {product.description.substring(0, 100)}...
                                                </Typography>
                                                <Box sx={{ mt: 2 }}>
                                                    <IconButton
                                                        onClick={() => setFormDialog({ 
                                                            open: true, 
                                                            type: 'edit', 
                                                            product 
                                                        })}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => setDeleteDialog({ open: true, product })}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography>No products available.</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Product Form Dialog */}
            <Dialog 
                open={formDialog.open} 
                onClose={() => setFormDialog({ open: false, type: null, product: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
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
        </Container>
    );
};

export default SellerDashboard;