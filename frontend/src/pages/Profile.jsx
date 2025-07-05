import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const hostels = ['Bakul Nivas', 'Parijaat Nivas', 'OBH', 'NBH', 'Kadamba', 'GHRNBH'];

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            age: '',
            contactNumber: '',
            hostel: '',
            roomNumber: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            age: Yup.number().min(16, 'Must be at least 16 years old').required('Required'),
            contactNumber: Yup.string().matches(/^\d{10}$/, 'Must be a valid 10-digit number').required('Required'),
            hostel: Yup.string().required('Required'),
            roomNumber: Yup.string().required('Required')
        }),
        onSubmit: async (values) => {
            try {
                setError('');
                setSuccess('');
                const response = await api.put('/users/profile', {
                    ...values,
                    address: { hostel: values.hostel, roomNumber: values.roomNumber }
                });
                login(response.data.user, localStorage.getItem('token'));
                setSuccess('Profile updated successfully!');
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            }
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                const userData = response.data.user;
                formik.setValues({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    age: userData.age,
                    contactNumber: userData.contactNumber,
                    hostel: userData.hostel || '',
                    roomNumber: userData.room || ''
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const passwordFormik = useFormik({
        initialValues: { oldPassword: '', newPassword: '' },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Old password is required'),
            newPassword: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('New password is required')
                .notOneOf([Yup.ref('oldPassword')], 'New password must be different from old password')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
        }),
        onSubmit: async (values) => {
            try {
                setPasswordError('');
                setPasswordSuccess('');
                await api.put('/users/changePassword', values);
                setPasswordSuccess('Password updated successfully!');
            } catch (err) {
                setPasswordError(err.response?.data?.message || 'Failed to update password');
            }
        }
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Profile
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            {['firstName', 'lastName', 'age', 'contactNumber', 'roomNumber'].map((field, idx) => (
                                <Grid item xs={12} sm={6} key={idx}>
                                    <TextField
                                        fullWidth
                                        id={field}
                                        name={field}
                                        label={field.replace(/([A-Z])/g, ' $1').trim()}
                                        type={field === 'age' ? 'number' : 'text'}
                                        value={formik.values[field]}
                                        onChange={formik.handleChange}
                                        error={formik.touched[field] && Boolean(formik.errors[field])}
                                        helperText={formik.touched[field] && formik.errors[field]}
                                    />
                                </Grid>
                            ))}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="hostel"
                                    name="hostel"
                                    label="Hostel"
                                    select
                                    value={formik.values.hostel}
                                    onChange={formik.handleChange}
                                    error={formik.touched.hostel && Boolean(formik.errors.hostel)}
                                    helperText={formik.touched.hostel && formik.errors.hostel}
                                >
                                    {hostels.map((hostel) => (
                                        <MenuItem key={hostel} value={hostel}>
                                            {hostel}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                            Update Profile
                        </Button>
                    </form>
                </Paper>
            </Box>

            {/* Change Password Section */}
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Change Password
                    </Typography>

                    {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
                    {passwordSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passwordSuccess}</Alert>}

                    <form onSubmit={passwordFormik.handleSubmit}>
                        {['oldPassword', 'newPassword'].map((field, idx) => (
                            <TextField
                                key={idx}
                                fullWidth
                                label={field === 'oldPassword' ? 'Old Password' : 'New Password'}
                                name={field}
                                type={field === 'oldPassword' ? (showOldPassword ? 'text' : 'password') : (showNewPassword ? 'text' : 'password')}
                                value={passwordFormik.values[field]}
                                onChange={passwordFormik.handleChange}
                                error={passwordFormik.touched[field] && Boolean(passwordFormik.errors[field])}
                                helperText={passwordFormik.touched[field] && passwordFormik.errors[field]}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => field === 'oldPassword' ? setShowOldPassword(!showOldPassword) : setShowNewPassword(!showNewPassword)}>
                                                {field === 'oldPassword' ? (showOldPassword ? <VisibilityOff /> : <Visibility />) : (showNewPassword ? <VisibilityOff /> : <Visibility />)}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        ))}
                        <Button type="submit" variant="contained">Change Password</Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;
