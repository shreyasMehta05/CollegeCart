// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from './catchAsyncErrors.js';

export const protect = catchAsyncErrors(async (req, res, next) => {
    // console.log("--------------------------- >> req", req);
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
    ? req.headers.authorization.split(' ')[1] 
    : req.headers.authorization; // This will return the token without "Bearer"
    console.log("--------------------------- >> token", token);

    if (!token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // if('67a5fee9bdbe4dbcab8d2e93'==decoded.id){
        //     console.log('decoded',decoded);
        // }
        console.log("--------------------------- >> decoded", decoded);
        req.user = await User.findById(decoded.id);
        console.log("--------------------------- >> req.user", req.user);
        next();
    } catch (error) {
        return next(new ErrorHandler('Authentication failed', 401));
    }
});

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler('Access denied', 403));
        }
        next();
    };
};