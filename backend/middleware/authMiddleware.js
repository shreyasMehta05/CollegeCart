import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from './catchAsyncErrors.js';

export const protect = catchAsyncErrors(async (req, res, next) => {
    let token;
    console.log("req.headers.authorization", req.headers.authorization);
    console.log("req.cookies.token", req.cookies.token);
    
    // Check if the token is in the Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Check if the token is in the cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    console.log("token", token);

    // If no token is found, return an error
    if (!token) {
        return next(new ErrorHandler('No token, authorization denied', 401));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user to the request object
        req.user = await User.findById(decoded.id);
        
        // Continue to the next middleware or route handler
        next();
    } catch (err) {
        return next(new ErrorHandler('Invalid token, authorization denied', 401));
    }
});

export const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is authorized to access this route
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        // If authorized, continue to the next middleware or route handler
        next();
    };
};
