import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express from 'express';
import { storage } from '../storage';
import type { Express, Request, Response } from 'express';

const JWT_SECRET = process.env.SESSION_SECRET!;
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function setupJWTAuth(app: Express) {
  app.use(express.json());
  
  // Login endpoint
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Find user by email
      const users = await storage.getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = generateToken(user.id, user.email);
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Register endpoint
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName) {
        return res.status(400).json({ message: 'Email, password, and first name are required' });
      }
      
      // Check if user already exists
      const users = await storage.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const newUser = await storage.upsertUser({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName,
        lastName: lastName || '',
        passwordHash,
        provider: 'email'
      });
      
      // Generate JWT token
      const token = generateToken(newUser.id, newUser.email);
      
      res.json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          profileImageUrl: newUser.profileImageUrl
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get current user endpoint
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      
      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      const user = await storage.getUser(payload.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Password reset endpoint
  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Find user by email
      const users = await storage.getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: 'If an account with that email exists, we sent a reset link.' });
      }
      
      // In a real app, you would send an email here
      // For now, we'll just log the reset token
      const resetToken = generateToken(user.id, user.email);
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      res.json({ message: 'If an account with that email exists, we sent a reset link.' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Logout endpoint (client-side token removal)
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.json({ message: 'Logged out successfully' });
  });
}

// Middleware to require authentication
export function requireAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  req.user = payload;
  next();
}

// Helper function to get user ID from JWT
export function getUserId(req: any): string {
  return req.user.userId;
}