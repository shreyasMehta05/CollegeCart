import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  FormControl,
  OutlinedInput,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authUtils } from '../utils/auth';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  School,
} from '@mui/icons-material';

// Styled components
const LoginContainer = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 100px)',
  padding: '20px',
  maxWidth: '1000px',
});

const LoginCard = styled(Paper)({
  display: 'flex',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  width: '100%',
});

const LeftPanel = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to bottom, #1a365d, #2a4365)`,
  color: '#ffffff',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '45%',
  backgroundImage: `
    radial-gradient(circle at 20% 25%, rgba(79, 209, 197, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 80% 75%, rgba(66, 153, 225, 0.05) 0%, transparent 25%),
    linear-gradient(to bottom, #1a365d, #2a4365)
  `,
  backgroundSize: 'cover',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '40px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '10px',
  borderRadius: '5px', 
  fontWeight: 600,
  textTransform: 'none',
  marginTop: '10px',
}));

const CircleImage = styled(Box)({
  width: '180px',
  height: '180px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(8px)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  margin: '20px 0',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
});

const Pattern = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.08,
  backgroundImage: `
    linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.2) 26%, transparent 27%, transparent 74%, 
    rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.2) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.2) 26%, transparent 27%, transparent 74%, 
    rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.2) 76%, transparent 77%, transparent)
  `,
  backgroundSize: '50px 50px',
});

const DollarIcon = styled(Box)({
  position: 'absolute',
  width: '30px',
  height: '30px',
  backgroundColor: '#4FD1C5',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  top: '35%',
  left: '25%',
  boxShadow: '0 4px 12px rgba(79, 209, 197, 0.3)',
});

const DocIcon = styled(Box)({
  position: 'absolute',
  width: '30px',
  height: '30px',
  backgroundColor: '#4299E1',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  bottom: '35%',
  right: '25%',
  boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)',
});

const Circle = styled(Box)(({ top, right, left, bottom, size }) => ({
  position: 'absolute',
  width: size || '60px',
  height: size || '60px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  top: top || 'auto',
  right: right || 'auto',
  left: left || 'auto',
  bottom: bottom || 'auto',
}));

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use a ref to ensure token processing only happens once.
  const tokenProcessed = useRef(false);
  
  useEffect(() => {
    // Only run this logic if it hasn't been processed yet.
    if (tokenProcessed.current) return;
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    if (token) {
      tokenProcessed.current = true; // Prevent future runs
      // Save the token and user data in local storage via your auth utilities.
      authUtils.setAuthData(token, { email });
      // Update your auth context.
      login({ email }, token);
      // Redirect to the homepage.
      navigate('/profile', { replace: true });
    }
  }, [location.search, login, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .matches(/@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/, 'Must be an IIIT email')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      if (!recaptchaValue) {
        setError('Please complete the reCAPTCHA verification.');
        return;
      }
      try {
        setLoading(true);
        setError('');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          ...values,
          recaptcha: recaptchaValue
        });
        
        setSuccess('Login successful! Redirecting...');
        
        // Save token and user data using your auth helper.
        authUtils.setAuthData(response.data.token, response.data.user);
        // Update the auth context.
        login(response.data.user, response.data.token);
        
        // Short delay before redirect for better UX
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    if (error) setError('');
  };

  const handleCASLogin = () => {
    setLoading(true);
    console.log('Initiating CAS login');
    const serviceURL = encodeURIComponent('http://localhost:5000/api/auth/cas/callback');
    window.location.href = `https://login.iiit.ac.in/cas/login?service=${serviceURL}`;
  };

  return (
    <LoginContainer maxWidth="lg">
      <LoginCard elevation={3}>
        <LeftPanel>
          <Pattern />
          <Circle top="20px" right="20px" size="100px" />
          <Circle bottom="30px" left="20px" size="80px" />
          
          <Typography variant="h4" fontWeight="700" sx={{ textAlign: 'center', mb: 1 }}>
            Welcome Back!
          </Typography>
          
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 3, opacity: 0.9 }}>
            Your one-stop marketplace for all campus needs
          </Typography>
          
          <CircleImage>
            {/* Shopping cart SVG */}
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white"/>
            </svg>
            
            <DollarIcon>$</DollarIcon>
            <DocIcon>📚</DocIcon>
          </CircleImage>
          
          <Box sx={{ mt: 5 }}>
            <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
              Don't have an account?
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#fff',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        </LeftPanel>
        
        <RightPanel>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <School sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h5" fontWeight="600">
              Log In
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                IIIT Email
              </Typography>
              <FormControl fullWidth variant="outlined">
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Email fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  placeholder="Enter your IIIT email"
                  sx={{
                    borderRadius: '5px',
                  }}
                />
                {formik.touched.email && formik.errors.email && (
                  <Typography variant="caption" color="error">
                    {formik.errors.email}
                  </Typography>
                )}
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Password
              </Typography>
              <FormControl fullWidth variant="outlined">
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter your password"
                  sx={{
                    borderRadius: '5px',
                  }}
                />
                {formik.touched.password && formik.errors.password && (
                  <Typography variant="caption" color="error">
                    {formik.errors.password}
                  </Typography>
                )}
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link to="/forgot-password" style={{ 
                textDecoration: 'none', 
                color: theme.palette.primary.main,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                Forgot password?
              </Link>
            </Box>
            
            <Box sx={{ my: 3 }}>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
              />
            </Box>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{ 
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </StyledButton>
          </form>
          
          <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
              Or
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          
          <StyledButton 
            variant="outlined" 
            fullWidth 
            onClick={handleCASLogin} 
            color="secondary"
            startIcon={<School />}
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            Sign in with IIIT CAS
          </StyledButton>
          
          {isMobile && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/register" style={{ 
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          )}
        </RightPanel>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
