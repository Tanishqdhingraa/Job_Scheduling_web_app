import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_in_production';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Check if token is blacklisted
        const isBlacklisted = await redisClient.get(`blacklist_${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token has been revoked/logged out. Please login again.' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role }
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(400).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
