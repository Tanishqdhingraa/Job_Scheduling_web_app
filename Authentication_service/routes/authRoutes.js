import express from 'express';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { register, login, logout, getMe } from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

export default router;
