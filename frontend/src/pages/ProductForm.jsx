import React, { useState, useEffect } from 'react';
import {
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Box,
    Chip,
    InputAdornment,
    styled,
    FormHelperText,
    Divider,
    Fade,
    Tooltip,
    CircularProgress,
    useTheme,
    alpha,
    IconButton
} from '@mui/material';
import {
    AddPhotoAlternate,
    Category,
    Sell,
    Description,
    Info,
    CheckCircle,
    Error as ErrorIcon,
    Save,
    Cancel,
    ImageOutlined,
    SellOutlined,
    DescriptionOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled components for enhanced UI
const FormContainer = styled(motion.div)(({ theme }) => ({
    padding: theme.spacing(3),
    position: 'relative'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        transition: 'all 0.3s ease',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        },
        '&.Mui-focused': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
    }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        transition: 'all 0.3s ease',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        },
        '&.Mui-focused': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
    }
}));

const ImagePreview = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 200,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.05)
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    padding: theme.spacing(1.2, 3),
    fontWeight: 600,
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
    }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.text.primary,
    '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1.5),
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        padding: 6,
        borderRadius: 8
    }
}));

const FormSection = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: 16,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
}));

const ProductForm = ({ initialData = null, onSubmit, onCancel }) => {
    const theme = useTheme();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        condition: '',
        images: '',
        ratings: {
            average: 0,
            count: 0
        }
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    const categories = ['Electronics', 'Books', 'Clothing', 'Food', 'Sports', 'Others'];
    const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.images) {
                setImagePreview(Array.isArray(initialData.images) ? initialData.images[0] : initialData.images);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear field-specific error when user makes changes
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const imageUrl = e.target.value;
        setFormData(prev => ({
            ...prev,
            images: imageUrl
        }));
        setImagePreview(imageUrl);
        
        if (fieldErrors.images) {
            setFieldErrors(prev => ({
                ...prev,
                images: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) errors.name = 'Product name is required';
        if (!formData.price) errors.price = 'Price is required';
        else if (parseFloat(formData.price) <= 0) errors.price = 'Price must be greater than zero';
        
        if (!formData.category) errors.category = 'Please select a category';
        if (!formData.condition) errors.condition = 'Please select the condition';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.images.trim()) errors.images = 'Image URL is required';
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate form
        if (!validateForm()) {
            setError('Please fix the errors before submitting.');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            // Form submitted successfully
        } catch (err) {
            setError(err.message || 'An error occurred while saving the product');
        } finally {
            setLoading(false);
        }
    };
    
    // Animation variants
    const formVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.4,
                staggerChildren: 0.1 
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <FormContainer
            initial="hidden"
            animate="visible"
            variants={formVariants}
        >
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3, 
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)'
                        }}
                        icon={<ErrorIcon />}
                    >
                        {error}
                    </Alert>
                </motion.div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Info Section */}
                <FormSection component={motion.div} variants={itemVariants}>
                    <SectionTitle variant="h6">
                        <SellOutlined />
                        Basic Information
                    </SectionTitle>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StyledTextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                error={!!fieldErrors.name}
                                helperText={fieldErrors.name}
                                placeholder="Enter a descriptive name for your product"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Sell color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledTextField
                                fullWidth
                                label="Price (₹)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                error={!!fieldErrors.price}
                                helperText={fieldErrors.price}
                                placeholder="0.00"
                                InputProps={{
                                    inputProps: { min: 0, step: "0.01" },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₹
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledFormControl 
                                fullWidth 
                                required 
                                variant="outlined"
                                error={!!fieldErrors.category}
                            >
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label="Category"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Category color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {fieldErrors.category && (
                                    <FormHelperText error>{fieldErrors.category}</FormHelperText>
                                )}
                            </StyledFormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <StyledFormControl 
                                fullWidth 
                                required 
                                variant="outlined"
                                error={!!fieldErrors.condition}
                            >
                                <InputLabel>Condition</InputLabel>
                                <Select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    label="Condition"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CheckCircle color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {conditions.map((condition) => (
                                        <MenuItem key={condition} value={condition}>
                                            <Chip 
                                                label={condition} 
                                                size="small" 
                                                color={
                                                    condition === 'New' ? 'primary' :
                                                    condition === 'Like New' ? 'success' :
                                                    condition === 'Good' ? 'info' :
                                                    condition === 'Fair' ? 'warning' : 'error'
                                                }
                                                sx={{ 
                                                    fontWeight: 500,
                                                    borderRadius: 3
                                                }}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {fieldErrors.condition && (
                                    <FormHelperText error>{fieldErrors.condition}</FormHelperText>
                                )}
                            </StyledFormControl>
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Description Section */}
                <FormSection component={motion.div} variants={itemVariants}>
                    <SectionTitle variant="h6">
                        <DescriptionOutlined />
                        Product Description
                    </SectionTitle>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StyledTextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                multiline
                                rows={4}
                                error={!!fieldErrors.description}
                                helperText={fieldErrors.description || "Provide a detailed description of your product"}
                                placeholder="Describe your product's features, specifications, and condition"
                            />
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Image Section */}
                <FormSection component={motion.div} variants={itemVariants}>
                    <SectionTitle variant="h6">
                        <ImageOutlined />
                        Product Image
                    </SectionTitle>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StyledTextField
                                fullWidth
                                label="Image URL"
                                name="images"
                                value={formData.images}
                                onChange={handleImageChange}
                                required
                                variant="outlined"
                                error={!!fieldErrors.images}
                                helperText={fieldErrors.images || "Enter a URL for your product image"}
                                placeholder="https://example.com/product-image.jpg"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AddPhotoAlternate color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Fade in={!!formData.images}>
                                <ImagePreview>
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Product preview" 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'contain' 
                                            }} 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <AddPhotoAlternate sx={{ fontSize: 40, color: 'text.disabled' }} />
                                            <Typography color="text.secondary">
                                                Image preview will appear here
                                            </Typography>
                                        </Box>
                                    )}
                                </ImagePreview>
                            </Fade>
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Action Buttons */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'flex-end',
                        mt: 4
                    }}
                    component={motion.div}
                    variants={itemVariants}
                >
                    <Tooltip title="Cancel">
                        <ActionButton
                            variant="outlined"
                            onClick={onCancel}
                            color="inherit"
                            startIcon={<Cancel />}
                            sx={{
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2
                                }
                            }}
                        >
                            Cancel
                        </ActionButton>
                    </Tooltip>
                    <Tooltip title={initialData ? "Save Changes" : "Add Product"}>
                        <ActionButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                            sx={{ 
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5153c3 0%, #7a4fd8 100%)'
                                }
                            }}
                        >
                            {initialData 
                                ? (loading ? 'Updating...' : 'Update Product') 
                                : (loading ? 'Adding...' : 'Add Product')
                            }
                        </ActionButton>
                    </Tooltip>
                </Box>
            </form>
        </FormContainer>
    );
};

export default ProductForm;