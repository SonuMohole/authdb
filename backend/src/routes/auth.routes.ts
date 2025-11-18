import { Router } from 'express';
import {
    forgotPassword,
    internalLogin,
    login,
    logout,
    register,
    resetPassword,
    verifyEmail,
} from '../controllers/auth.controller';

const router = Router();

// PUBLIC ROUTES
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

// INTERNAL ROUTE (FASTAPI → NODE.JS)
router.post('/internal-login', internalLogin);

export default router;
