import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import { publishLoginEvent } from '../config/rabbitmq.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_in_production';
const JWT_EXPIRES_IN = '1h';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully', user: {
                id: user._id, name: user.name,
                email: user.email, role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Publish login event
        await publishLoginEvent(user.email, user.name);

        res.json({
            message: 'Login successful', token, user: {
                id: user._id, name: user.name, email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(400).json({ message: 'Token not provided' });
        }

        // Add token to blacklist in Redis (expiry match JWT_EXPIRES_IN roughly)
        // JWT TTL is 1 hour = 3600 seconds
        await redisClient.setEx(`blacklist_${token}`, 3600, 'true');

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
