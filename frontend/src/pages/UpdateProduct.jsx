import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, CircularProgress, Box } from '@mui/material';
import ProductForm from './ProductForm';

const UpdateProduct = ({ onCancel, onSuccess }) => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch product');
            
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            setError('Failed to load product details');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update product');

            onSuccess();
        } catch (err) {
            throw new Error(err.message || 'Error updating product');
        }
    };

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!product) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ProductForm
            initialData={product}
            onSubmit={handleUpdate}
            onCancel={onCancel}
        />
    );
};

export default UpdateProduct;