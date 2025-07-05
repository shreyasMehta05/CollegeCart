import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = ({ onCancel, onSuccess }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        condition: '',
        images: '', // Single image URL string
        ratings: {
            average: 0,
            count: 0
        }
    });

    const categories = ['Electronics', 'Books', 'Clothing', 'Food', 'Sports', 'Others'];
    const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.price || !formData.category || !formData.condition || !formData.description || !formData.images) {
            setError('All fields are required.');
            return;
        }

        if (formData.price <= 0) {
            setError('Price must be greater than zero.');
            return;
        }

        try {
            // Sending data as JSON
            const formDataToSend = {
                name: formData.name,
                price: formData.price,
                description: formData.description,
                category: formData.category,
                condition: formData.condition,
                images: formData.images,
                ratings: formData.ratings
            };

            const response = await axios.post('http://localhost:5000/api/products', formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // navigate('/seller/dashboard');
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Error adding product');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Add New Product
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Condition</InputLabel>
                                <Select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                >
                                    {conditions.map((condition) => (
                                        <MenuItem key={condition} value={condition}>
                                            {condition}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Image URL"
                                name="images"
                                value={formData.images}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Add Product
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AddProduct;
