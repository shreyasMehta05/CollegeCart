// controllers/authController.js
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // For parsing the CAS XML response



// Helper function to verify CAPTCHA
const verifyCaptcha = async (captchaToken) => {
  // Skip CAPTCHA verification if disabled
  if (process.env.DISABLE_CAPTCHA === 'true') {
      return true;
  }

  try {
      const recaptchaResponse = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
      );
      return recaptchaResponse.data.success;
  } catch (error) {
      console.error('CAPTCHA verification error:', error);
      return false;
  }
};


// Helper function to send token response
const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    // Cookie options
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };
    console.log('Token:', token);
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
};



export const register = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, password, age, contactNumber, captchaToken , address} = req.body;
    console.log('Registering user:', req.body);
    // Verify CAPTCHA
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
        return next(new ErrorHandler('CAPTCHA verification failed', 400));
    }

    // Rest of the registration logic...
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorHandler('Email already registered', 400));
    }
    const hostelName = address.hostel;
    const roomNumber = address.roomNumber;;
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        age,
        contactNumber,
        hostel: hostelName,
        room: roomNumber

    });

    sendToken(user, 201, res);
});

// Login user
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, captchaToken } = req.body;

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
        return next(new ErrorHandler('CAPTCHA verification failed', 400));
    }

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Check for too many login attempts
    if (user.loginAttempts.count >= 5 && 
        user.loginAttempts.lastAttempt > Date.now() - 15 * 60 * 1000) {
        return next(new ErrorHandler('Too many login attempts. Please try again later.', 429));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        // Update login attempts
        user.loginAttempts.count += 1;
        user.loginAttempts.lastAttempt = Date.now();
        await user.save();
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Reset login attempts on successful login
    user.loginAttempts.count = 0;
    user.lastLogin = Date.now();
    await user.save();

    sendToken(user, 200, res);
    console.log('Login successful');
    console.log('Token sent');
});

// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    console.log('Logged out successfully');
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Get current user profile
export const getMe = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});

// CAS Login Callback
export const casLoginCallback = catchAsyncErrors(async (req, res, next) => {
    console.log('CAS login callback');
    const { ticket } = req.query; // CAS ticket returned after login

    if (!ticket) {
        return next(new ErrorHandler('CAS ticket missing', 400));
    }

    // Validate the ticket with the CAS server
    const casResponse = await axios.get(
        `https://login.iiit.ac.in/cas/serviceValidate?ticket=${ticket}&service=${encodeURIComponent('http://localhost:5000/api/auth/cas/callback')}`
    );

    // Parse the CAS XML response
    const casData = await parseStringPromise(casResponse.data, { explicitArray: false });

    if (casData['cas:serviceResponse']['cas:authenticationSuccess']) {
        const email = casData['cas:serviceResponse']['cas:authenticationSuccess']['cas:user'];
        console.log('CAS login successful for:', email);
        // Check if the user exists in your database
        let existingUser = await User.findOne({ email });
        console.log('Existing user:', existingUser);
        if (!existingUser) {
            // Create a new user with default values for required fields
            existingUser = new User({
                email,
                firstName: 'Please enter first name', // Provide a default value
                lastName: 'Please enter last name', // Provide a default value
                age: 16, // Provide a default value
                contactNumber: '0000000000', // Provide a default value
                password: 'DefaultPasskey', // Placeholder for CAS
                hostel: 'Please enter hostel', // Provide a default value
                room: 'Please enter room number' // Provide a default value

            });
            await existingUser.save();
        }

        // Generate JWT token
        const token = existingUser.getJwtToken(); // Assuming you have this method on the User model
        console.log('Token:', token);
        console.log('Redirecting user to frontend with token and email');
        // Redirect the user to the frontend with the token and email
        res.redirect(`http://localhost:5173/login?token=${token}&email=${encodeURIComponent(email)}`);
    } else {
        return next(new ErrorHandler('CAS validation failed', 401));
    }
});