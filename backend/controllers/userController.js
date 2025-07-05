// controllers/userController.js
// const User = require('../models/User');
import User from '../models/User.js';
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, age, contactNumber, address } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, age, contactNumber, address },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    console.log("--------------------------- >> req.user._id", req.user._id);
    try {

        const user = await User.findById(req.user._id);
        console.log(user);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSellerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.sellerId)
            .select('firstName lastName ratings');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const changePassword = async (req, res) => {
    console.log("changePassword");
    console.log(req.body); // contains oldPassword and newPassword
    console.log(req.user); // test old password with req.user first match this id in the db and then check the password because we are not sending password in the body for security reasons
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id).select('+password');
        console.log(user);
        const isMatch = await user.comparePassword(oldPassword
        );
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

    
};

export { updateProfile, getProfile, getSellerProfile, changePassword };