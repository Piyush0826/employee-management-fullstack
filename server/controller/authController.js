import { compare, hash } from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong Password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_KEY, 
            { expiresIn: '10d' }
        );

        return res.status(200).json({ 
            success: true, 
            token, 
            user: { 
                _id: user._id, 
                name: user.name, 
                role: user.role 
            } 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const verify = async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validation
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
        }

        // Get user from database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Compare old password
        const isMatch = await compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Old password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ success: false, error: "Server error while changing password" });
    }
};

export { login, verify, changePassword };