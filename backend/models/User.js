// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// User schema ---> contains all the fields that a user can have
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        match: [/@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/, 'Only IIIT email addresses are allowed']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    age: {
        type: Number,
        required: [true, 'Please enter your age'],
        min: [16, 'Age must be at least 16'],
        max: [100, 'Age cannot exceed 100']
    },
    contactNumber: {
        type: String,
        required: [true, 'Please enter your contact number'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number']
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'admin'],
    //     default: 'user'
    // },
    hostel: {
        type: String,
        required: [true, 'Please enter your hostel']
    },
    room: {
        type: String,
        required: [true, 'Please enter your room number']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    loginAttempts: {
        count: { type: Number, default: 0 },
        lastAttempt: Date
    }
}, {
    timestamps: true
});

// Encrypt password before saving using bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method for login can be used in auth controller
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token we will store the  id of the user in the token--> can be used to authenticate the user
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

export default mongoose.model('User', userSchema);