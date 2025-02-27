import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, UserType, UserStatus } from '../models';
import { ApiError } from '../middleware/error.middleware';

// JWT token secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'logu-secret-key';

// Token expiration time
const TOKEN_EXPIRATION = '7d';

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, type, phone, websiteUrl, bio, socialLinks } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    // Validate user type
    if (!Object.values(UserType).includes(type)) {
      throw new ApiError(400, 'Invalid user type');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by model hook
      type,
      status: UserStatus.PENDING, // Default status is PENDING
      phone,
      websiteUrl,
      bio,
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        type: user.type,
        status: user.status
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    // Return user data (excluding password) and token
    const userData = user.toJSON();
    if (userData.password) {
      delete userData.password;
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new ApiError(403, 'Your account is not active. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        type: user.type,
        status: user.status
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    // Return user data (excluding password) and token
    const userData = user.toJSON();
    if (userData.password) {
      delete userData.password;
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User should be attached to request by auth middleware
    const user = req.user;
    
    if (!user) {
      throw new ApiError(401, 'Authentication required');
    }
    
    return res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User should be attached to request by auth middleware
    const userId = req.user?.id;
    
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const { name, phone, websiteUrl, bio, socialLinks, profileImage } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Update fields
    await user.update({
      name: name || user.name,
      phone: phone || user.phone,
      websiteUrl: websiteUrl || user.websiteUrl,
      bio: bio || user.bio,
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : user.socialLinks,
      profileImage: profileImage || user.profileImage
    });

    // Return updated user (excluding password)
    const userData = user.toJSON();
    if (userData.password) {
      delete userData.password;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userData
      }
    });
  } catch (error) {
    next(error);
  }
}; 