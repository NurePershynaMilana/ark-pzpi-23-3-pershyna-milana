import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { ApiResponse, RegisterRequest, LoginRequest, LoginResponse } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Ensure JWT_SECRET is a string for TypeScript
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

// POST /api/auth/register - Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, first_name, last_name, password }: RegisterRequest = req.body;
    
    // Validation
    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    await User.create({
      email: String(email),
      first_name: String(first_name),
      last_name: String(last_name),
      password_hash,
      role: 'user'
    });
    
    // Find the created user (exclude password_hash from response)
    const user = await User.findOne({ 
      where: { email },
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      throw new Error('User creation failed');
    }
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      },
      message: 'User registered successfully. Please login to get access token.'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
};

// POST /api/auth/login - User login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Find user by email (include password_hash for verification)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Verify password_hash exists
    if (!user.password_hash) {
      return res.status(500).json({
        success: false,
        error: 'User data corrupted'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
    
    // Update last_login
    await user.update({ last_login: new Date() });
    
    // Return response (exclude password_hash)
    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          last_login: new Date(),
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        token
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
};

// POST /api/auth/logout - User logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout'
    });
  }
};

// GET /api/auth/me - Get current user profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
};