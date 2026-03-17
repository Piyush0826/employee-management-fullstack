import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => { // 1. Added async
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // 2. Ensure JWT_SECRET matches your .env variable name!
        const decoded = jwt.verify(token, process.env.JWT_KEY); 
        
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        // 3. Added await here
        const user = await User.findById({ _id: decoded._id }).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Exporting it as authMiddleware so your routes file doesn't break
export { verifyUser as authMiddleware };