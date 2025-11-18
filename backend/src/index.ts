import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// --------------------
// 1. GLOBAL MIDDLEWARE
// --------------------
app.use(express.json());
app.use(cookieParser());

// CORS for global users (React frontend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // example: https://myapp.com
    credentials: true,
  })
);

// Disable caching (should be placed before routes)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// ---------------------------------------------
// 2. INTERNAL API KEY MIDDLEWARE (FastAPI usage)
// ---------------------------------------------
app.use((req, res, next) => {
  // Only protect /internal routes
  if (req.path.startsWith('/api/auth/internal')) {
    const apiKey = req.headers['x-internal-api-key'];
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(403).json({ error: 'Forbidden: Invalid internal API key' });
    }
  }
  next();
});

// --------------------
// 3. ROUTES
// --------------------
app.use('/api/auth', authRoutes);

// --------------------
// 4. SERVER START
// --------------------
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('Auth Server running on', port);
});
