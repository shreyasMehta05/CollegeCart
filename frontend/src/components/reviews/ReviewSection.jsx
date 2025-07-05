// src/components/reviews/ReviewSection.js
import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Rating,
    TextField,
    Button,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ReviewSection = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/product/${productId}`);
            setReviews(response.data.reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const submitReview = async () => {
        try {
            await axios.post('/api/reviews', {
                productId,
                ...newReview
            });
            setNewReview({ rating: 0, comment: '' });
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Reviews
            </Typography>

            {user && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Write a Review
                    </Typography>
                    <Rating
                        value={newReview.rating}
                        onChange={(e, newValue) => setNewReview(prev => ({
                            ...prev,
                            rating: newValue
                        }))}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({
                            ...prev,
                            comment: e.target.value
                        }))}
                        placeholder="Write your review here..."
                        sx={{ mt: 2, mb: 1 }}
                    />
                    <Button
                        variant="contained"
                        onClick={submitReview}
                        disabled={!newReview.rating || !newReview.comment}
                    >
                        Submit Review
                    </Button>
                </Box>
            )}

            <List>
                {reviews.map((review) => (
                    <React.Fragment key={review._id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar>{review.user.firstName[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography component="span">
                                            {review.user.firstName} {review.user.lastName}
                                        </Typography>
                                        <Rating
                                            value={review.rating}
                                            readOnly
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </Typography>
                                        {" — "}{review.comment}
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

export default ReviewSection;