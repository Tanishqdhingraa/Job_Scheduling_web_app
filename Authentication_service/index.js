import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import './config/redis.js'; // Initialize Redis
import { connectRabbitMQ, consumeLoginEvents } from './config/rabbitmq.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log("MONGO_URI is not defined in the environment variables.");
        } else {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected...');
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

connectDB().then(() => {
    connectRabbitMQ().then(() => {
        consumeLoginEvents();
    });
});

// Routes
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Authentication Service is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});