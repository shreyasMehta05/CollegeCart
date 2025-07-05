// src/components/reviews/ReviewsList.js
import React from 'react';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Rating,
    Box
} from '@mui/material';

const ReviewsList = ({ reviews }) => {
    return (
        <List>
            {reviews.map((review) => (
                <ListItem
                    key={review._id}
                    sx={{
                        mb: 2,
                        border: '1px solid #ddd',
                        borderRadius: 1
                    }}
                >
                    <ListItemAvatar>
                        <Avatar>
                            {review.user.firstName[0]}
                            {review.user.lastName[0]}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1">
                                    {review.user.firstName} {review.user.lastName}
                                </Typography>
                                <Rating value={review.rating} readOnly size="small" />
                            </Box>
                        }
                        secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {review.comment}
                                </Typography>
                                <br />
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Typography>
                            </>
                        }
                    />
                </ListItem>
            ))}
            {reviews.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                    No reviews yet
                </Typography>
            )}
        </List>
    );
};

export default ReviewsList;