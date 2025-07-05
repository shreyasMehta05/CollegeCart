// src/pages/Register.jsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Person,
  CalendarToday,
  Phone,
  Email,
  Lock,
  HowToReg,
  Home,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  School,
  Apartment,
  Badge
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// Define hostel options
const hostels = [
  'OBH',
  'NBH',
  'Bakul',
  'Parijaat',
  'OBH-E',
  'NBH-E'
];

// Define the step labels
const steps = ['Personal Info', 'Contact Details', 'Account Setup'];

// Fields for each step
const stepFields = {
  0: ['firstName', 'lastName', 'age'],
  1: ['contactNumber', 'hostel', 'roomNumber'],
  2: ['email', 'password', 'confirmPassword']
};

// Styled components
const RegisterContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 100px)',
  padding: theme.spacing(3),
}));

const RegisterCard = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  padding: 0,
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  maxWidth: '1000px',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    maxWidth: '500px',
  }
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  }
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: 1,
  background: `linear-gradient(135deg, #1a365d 0%, #2a4365 100%)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#F7FAFC',
  padding: theme.spacing(5),
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: `
    radial-gradient(circle at 20% 25%, rgba(79, 209, 197, 0.2) 0%, transparent 25%),
    radial-gradient(circle at 80% 75%, rgba(66, 153, 225, 0.2) 0%, transparent 25%),
    linear-gradient(135deg, #152a4d 0%, #1e3a5f 50%, #274875 100%)
  `,
  backgroundSize: 'cover',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.2),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '.MuiStepConnector-line': {
    minHeight: 40,
  },
  '.MuiStepLabel-root': {
    padding: theme.spacing(0, 2),
  },
  '.MuiStepLabel-iconContainer': {
    '& .MuiSvgIcon-root': {
      width: 32,
      height: 32,
    }
  }
}));

// Define components for decorative elements
const DecorativeCircle = styled(Box)(({ size, opacity, top, left, right, bottom }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 70%)',
  opacity: opacity || 0.1,
  top: top || 'auto',
  left: left || 'auto',
  right: right || 'auto',
  bottom: bottom || 'auto',
  zIndex: 0
}));

// Define component for decorative patterns
const DecorativePattern = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, 
    rgba(255, 255, 255, 0.03) 75%, rgba(255, 255, 255, 0.03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, 
    rgba(255, 255, 255, 0.03) 75%, rgba(255, 255, 255, 0.03) 76%, transparent 77%, transparent)
  `,
  backgroundSize: '50px 50px',
  zIndex: 0
});

// Static element component to replace the floating animated elements
const StaticElement = styled(Box)(({ size, top, left, right, bottom, color }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: color || 'rgba(255, 255, 255, 0.2)',
  top: top || 'auto',
  left: left || 'auto',
  right: right || 'auto',
  bottom: bottom || 'auto',
  zIndex: 0,
  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
}));

// Validation schema for the form
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z]+$/, 'Only alphabets are allowed'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z]+$/, 'Only alphabets are allowed'),
  age: Yup.number()
    .required('Age is required')
    .min(16, 'Must be at least 16 years old')
    .max(100, 'Age cannot exceed 100'),
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(/^\d{10}$/, 'Must be a valid 10-digit number'),
  hostel: Yup.string()
    .required('Hostel is required'),
  roomNumber: Yup.string()
    .required('Room number is required')
    .matches(/^[A-Za-z0-9-]+$/, 'Invalid room number format'),
  email: Yup.string()
    .email('Invalid email address')
    .matches(/@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/, 'Must be an IIIT email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const Register = () => {
  // Hooks
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // For the visual step indicator
  
  // Media query for responsive design
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      age: '',
      contactNumber: '',
      hostel: '',
      roomNumber: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      // Final submission
      try {
        setLoading(true);
        setError('');
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          ...values,
          address: {
            hostel: values.hostel,
            roomNumber: values.roomNumber
          }
        });
        
        setCompleted(true);
        
        // Short delay for better UX
        setTimeout(() => {
          login(response.data.user, response.data.token);
          toast.success('Registration successful!');
          navigate('/');
        }, 1500);
      } catch (err) {
        const errMsg = err.response?.data?.message || 'An error occurred during registration';
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    }
  });

  // Validation when the next button is clicked
  const handleNext = async () => {
    const fieldsToValidate = stepFields[activeStep];
    try {
      // Validate only the fields for current step
      const errors = await formik.validateForm();
      const stepErrors = fieldsToValidate.filter((field) => errors[field]);
      
      if (stepErrors.length > 0) {
        // Mark fields as touched to display errors
        fieldsToValidate.forEach((field) => formik.setFieldTouched(field, true));
        return;
      }
      
      // Move to next step if validation passes
      setActiveStep((prev) => prev + 1);
      setCurrentStep((prev) => Math.min(prev + 1, 3)); // Update visual step indicator
      
      // If this is the final step, submit the form
      if (activeStep === steps.length - 1) {
        formik.handleSubmit();
      }
    } catch (validationError) {
      // Mark fields as touched in case of validation error
      fieldsToValidate.forEach((field) => formik.setFieldTouched(field, true));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setCurrentStep((prev) => Math.max(prev - 1, 1)); // Update visual step indicator
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Personal Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tell us about yourself to set up your account
              </Typography>
            </Grid>
            
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Age */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="age"
                name="age"
                label="Age"
                type="number"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Contact Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Provide your contact and location information
              </Typography>
            </Grid>
            
            {/* Contact Number */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="contactNumber"
                name="contactNumber"
                label="Contact Number"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Hostel */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="hostel"
                name="hostel"
                label="Hostel"
                select
                value={formik.values.hostel}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.hostel && Boolean(formik.errors.hostel)}
                helperText={formik.touched.hostel && formik.errors.hostel}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Apartment color="action" />
                    </InputAdornment>
                  )
                }}
              >
                {hostels.map((hostel) => (
                  <MenuItem key={hostel} value={hostel}>
                    {hostel}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            {/* Room Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="roomNumber"
                name="roomNumber"
                label="Room Number"
                value={formik.values.roomNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
                helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Account Credentials
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set up your login details and secure your account
              </Typography>
            </Grid>
            
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="IIIT Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Password */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Confirm Password */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        );
      
      default:
        return 'Unknown step';
    }
  };

  const renderSuccessContent = () => (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: theme.palette.success.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 3,
          color: 'white'
        }}
      >
        <HowToReg sx={{ fontSize: 40 }} />
      </Box>

      <Typography variant="h5" gutterBottom fontWeight={600}>
        Registration Successful!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 1 }}>
        Your account has been created successfully.
      </Typography>
      <Typography variant="body1" paragraph>
        Redirecting you to the homepage...
      </Typography>
      <CircularProgress size={24} sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <RegisterContainer maxWidth={false}>
      <RegisterCard elevation={10}>
        <ImageSection>
          {/* Decorative elements */}
          <DecorativeCircle size="300px" opacity={0.1} top="-80px" right="-100px" />
          <DecorativeCircle size="250px" opacity={0.12} bottom="-50px" left="-70px" />
          <DecorativePattern />
          
          {/* Static elements replacing animated ones */}
          <StaticElement 
            size="15px" 
            top="15%" 
            left="15%" 
            color="rgba(79, 209, 197, 0.4)"
          />
          <StaticElement 
            size="20px" 
            bottom="25%" 
            right="20%" 
            color="rgba(66, 153, 225, 0.4)"
          />
          <StaticElement 
            size="10px" 
            top="60%" 
            left="25%" 
            color="rgba(255, 255, 255, 0.3)"
          />
          <StaticElement 
            size="30px" 
            top="30%" 
            right="30%" 
            color="rgba(144, 205, 244, 0.3)"
          />
          <StaticElement 
            size="25px" 
            bottom="40%" 
            left="35%" 
            color="rgba(126, 213, 200, 0.3)"
          />
          
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" fontWeight="700" gutterBottom sx={{ 
              color: '#FFFFFF', 
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}>
              Join CollegeCart
            </Typography>
            
            <Typography variant="body1" sx={{ 
              color: '#F7FAFC', 
              maxWidth: '80%', 
              mx: 'auto',
              fontSize: '1.05rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              letterSpacing: '0.3px'
            }}>
              Create your account to start buying and selling on campus
            </Typography>
          </Box>
          
          {/* Campus marketplace illustration (static version) */}
          <Box sx={{ position: 'relative', my: 4, display: 'flex', justifyContent: 'center', width: '100%', zIndex: 1 }}>
            <Box style={{
              width: 300, 
              height: 280, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Box sx={{
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Campus building illustration */}
                <Box sx={{ 
                  width: 200, 
                  height: 120, 
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  position: 'relative',
                  mb: 3
                }}>
                  {/* Windows */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '15px', 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255,255,255,0.25)'
                  }} />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '55px', 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255,255,255,0.25)'
                  }} />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '55px', 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255,255,255,0.25)'
                  }} />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '15px', 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255,255,255,0.25)'
                  }} />
                  
                  {/* Door */}
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: '0px', 
                    left: '85px', 
                    width: '30px', 
                    height: '40px', 
                    borderTopLeftRadius: '4px', 
                    borderTopRightRadius: '4px', 
                    backgroundColor: 'rgba(255,255,255,0.3)'
                  }} />
                </Box>

                {/* Shopping cart and marketplace elements */}
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {/* Shopping item 1 */}
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: '#4FD1C5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(79, 209, 197, 0.3)'
                  }}>
                    $
                  </Box>

                  {/* Shopping item 2 */}
                  <Box sx={{ 
                    width: 45, 
                    height: 45, 
                    backgroundColor: '#4299E1',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
                  }}>
                    📚
                  </Box>

                  {/* Shopping item 3 */}
                  <Box sx={{ 
                    width: 35, 
                    height: 35, 
                    backgroundColor: '#805AD5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(128, 90, 213, 0.3)'
                  }}>
                    💻
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Multi-step process visualization with improved visibility */}
          <Box sx={{ 
            width: '100%', 
            mt: 2,
            mb: 2, 
            display: 'flex', 
            justifyContent: 'center',
            position: 'relative', 
            zIndex: 1 
          }}>
            <Box sx={{ 
              width: '80%',
              maxWidth: '380px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(5px)',
              borderRadius: '16px', 
              padding: '16px 24px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                position: 'relative'
              }}>
                {/* Step 1 */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  zIndex: 2
                }}>
                  <Box sx={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: currentStep === 1 ? 'rgba(79, 209, 197, 0.9)' : currentStep > 1 ? 'rgba(79, 209, 197, 0.7)' : 'rgba(255, 255, 255, 0.15)',
                    border: '2px solid',
                    borderColor: currentStep >= 1 ? '#4FD1C5' : 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: currentStep === 1 ? '0 0 0 4px rgba(79, 209, 197, 0.3)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    1
                  </Box>
                  <Typography 
                    sx={{ 
                      color: currentStep === 1 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)', 
                      mt: 1, 
                      fontSize: '0.85rem',
                      fontWeight: currentStep === 1 ? 600 : 400,
                      textShadow: currentStep === 1 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                    }}
                  >
                    Personal
                  </Typography>
                </Box>

                {/* Step 2 */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  zIndex: 2
                }}>
                  <Box sx={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: currentStep === 2 ? 'rgba(79, 209, 197, 0.9)' : currentStep > 2 ? 'rgba(79, 209, 197, 0.7)' : 'rgba(255, 255, 255, 0.15)',
                    border: '2px solid',
                    borderColor: currentStep >= 2 ? '#4FD1C5' : 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: currentStep === 2 ? '0 0 0 4px rgba(79, 209, 197, 0.3)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    2
                  </Box>
                  <Typography 
                    sx={{ 
                      color: currentStep === 2 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)', 
                      mt: 1, 
                      fontSize: '0.85rem',
                      fontWeight: currentStep === 2 ? 600 : 400,
                      textShadow: currentStep === 2 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                    }}
                  >
                    Contact
                  </Typography>
                </Box>

                {/* Step 3 */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  zIndex: 2
                }}>
                  <Box sx={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: currentStep === 3 ? 'rgba(79, 209, 197, 0.9)' : currentStep > 3 ? 'rgba(79, 209, 197, 0.7)' : 'rgba(255, 255, 255, 0.15)',
                    border: '2px solid',
                    borderColor: currentStep >= 3 ? '#4FD1C5' : 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: currentStep === 3 ? '0 0 0 4px rgba(79, 209, 197, 0.3)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    3
                  </Box>
                  <Typography 
                    sx={{ 
                      color: currentStep === 3 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)', 
                      mt: 1, 
                      fontSize: '0.85rem',
                      fontWeight: currentStep === 3 ? 600 : 400,
                      textShadow: currentStep === 3 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                    }}
                  >
                    Account
                  </Typography>
                </Box>

                {/* Connector lines */}
                <Box sx={{ 
                  position: 'absolute',
                  top: '20px',
                  left: '40px',
                  right: '40px',
                  height: '2px',
                  zIndex: 1
                }}>
                  {/* First connector line */}
                  <Box sx={{ 
                    position: 'absolute',
                    left: '0%',
                    width: '50%',
                    height: '2px',
                    backgroundColor: currentStep > 1 ? '#4FD1C5' : 'rgba(255, 255, 255, 0.3)'
                  }}/>
                  
                  {/* Second connector line */}
                  <Box sx={{ 
                    position: 'absolute',
                    left: '50%',
                    width: '50%',
                    height: '2px',
                    backgroundColor: currentStep > 2 ? '#4FD1C5' : 'rgba(255, 255, 255, 0.3)'
                  }}/>
                </Box>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography variant="body2" sx={{ color: '#F7FAFC', mb: 1, fontWeight: 500 }}>
              Already have an account?
            </Typography>
            <Button 
              component={Link} 
              to="/login" 
              variant="outlined" 
              size="medium"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.4)', 
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#FFFFFF',
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }
              }}
            >
              Log In
            </Button>
          </Box>
        </ImageSection>

        <FormSection>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Badge sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }} />
            <Typography variant="h4" fontWeight="700">
              Create Account
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {/* Show mobile stepper for smaller screens */}
          {isMobile && (
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
          
          <Box sx={{ mt: 2, mb: 3 }}>
            {completed ? (
              <div>{renderSuccessContent()}</div>
            ) : (
              <div>
                <form>
                  {renderStepContent(activeStep)}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0 || loading}
                      startIcon={<KeyboardArrowLeft />}
                      sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                    >
                      Back
                    </Button>
                    <StyledButton
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading}
                      endIcon={activeStep === steps.length - 1 ? null : <KeyboardArrowRight />}
                      startIcon={activeStep === steps.length - 1 ? (loading ? <CircularProgress size={20} /> : <HowToReg />) : null}
                      sx={{ minWidth: 120 }}
                    >
                      {activeStep === steps.length - 1 ? (loading ? 'Creating...' : 'Sign Up') : 'Continue'}
                    </StyledButton>
                  </Box>
                </form>
              </div>
            )}
          </Box>
          
          {!completed && (
            <Box sx={{ mt: 'auto', pt: 3, textAlign: 'center' }}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography component="span" color="primary" fontWeight="600">
                    Log In
                  </Typography>
                </Link>
              </Typography>
            </Box>
          )}
        </FormSection>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
