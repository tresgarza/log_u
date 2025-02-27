import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserType } from '../models';
import { getInfluencers } from '../controllers/user.controller';

const router = Router();

// TODO: Implement profile management endpoints
// This file will be expanded with user profile management endpoints

// Placeholder route for profile retrieval
router.get(
  '/profile',
  authenticate,
  (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  }
);

// Placeholder route for profile updates
router.put(
  '/profile',
  authenticate,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Profile update endpoint to be implemented',
      data: {
        user: req.user
      }
    });
  }
);

// Get influencers (for brands)
router.get(
  '/influencers',
  authenticate,
  authorize([UserType.BRAND]),
  getInfluencers
);

// Placeholder for getting all brands (influencer access only)
router.get(
  '/brands',
  authenticate,
  authorize([UserType.INFLUENCER]),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Brand listing endpoint to be implemented',
      data: {
        brands: []
      }
    });
  }
);

export default router; 