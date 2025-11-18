import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  sendResetEmail,
  sendVerificationEmail,
} from '../services/email.service';

const prisma = new PrismaClient();

// ==================================================================================
// REGISTER USER
// ==================================================================================
export const register = async (req: Request, res: Response) => {
  try {
    const {
      organisationName,
      organisationSize,
      organisationType,
      representative,
      designation,
      companyEmail,
      password,
      confirmPassword,
      mobile,
    } = req.body;

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    const existing = await prisma.user.findUnique({ where: { companyEmail } });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    await prisma.user.create({
      data: {
        organisationName,
        organisationSize,
        organisationType,
        representative,
        designation,
        companyEmail,
        password: hashedPassword,
        mobile,
        verificationToken,
        isVerified: false,
        accountStatus: 'active',
      },
    });

    await sendVerificationEmail(companyEmail, verificationToken);

    return res.status(201).json({
      message: 'Registration successful. Please verify your email.',
    });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==================================================================================
// VERIFY EMAIL
// ==================================================================================
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('Invalid token');

    const user = await prisma.user.findUnique({
      where: { verificationToken: String(token) },
    });

    if (!user) return res.status(400).send('Invalid token');

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    return res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
  } catch (err) {
    console.error('Email Verification Error:', err);
    return res.status(500).send('Server error');
  }
};

// ==================================================================================
// LOGIN (USED BY BOTH PUBLIC USERS AND FASTAPI)
// ==================================================================================
export const login = async (req: Request, res: Response) => {
  try {
    const { companyEmail, password } = req.body;

    const user = await prisma.user.findUnique({ where: { companyEmail } });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        message: `Your account is ${user.accountStatus}. Contact admin.`,
      });
    }

    const passwordOK = await bcrypt.compare(password, user.password);
    if (!passwordOK)
      return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: 'Please verify your email before logging in.' });

    const payload = {
      id: user.id,
      email: user.companyEmail,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || 'access',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'refresh',
      { expiresIn: '7d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==================================================================================
// INTERNAL LOGIN (FASTAPI → NODE.JS)
// ==================================================================================
export const internalLogin = async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers['x-internal-api-key'];

    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }

    const { companyEmail, password } = req.body;

    const user = await prisma.user.findUnique({ where: { companyEmail } });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const passwordOK = await bcrypt.compare(password, user.password);
    if (!passwordOK)
      return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, email: user.companyEmail };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || 'access',
      { expiresIn: '15m' }
    );

    return res.json({ accessToken });
  } catch (err) {
    console.error('Internal Login Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==================================================================================
// LOGOUT
// ==================================================================================
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================================================================================
// FORGOT PASSWORD
// ==================================================================================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { companyEmail } = req.body;

    const user = await prisma.user.findUnique({ where: { companyEmail } });
    if (!user)
      return res.json({ message: 'If a user exists, a reset email was sent' });

    const token = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, updatedAt: new Date() },
    });

    await sendResetEmail(companyEmail, token);

    return res.json({ message: 'If a user exists, a reset email was sent' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==================================================================================
// RESET PASSWORD
// ==================================================================================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        updatedAt: new Date(),
      },
    });

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
