import { Router } from 'express';
import { 
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  rateInfluencer,
  rateBrand
} from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserType } from '../models';

const router = Router();

/**
 * @route GET /api/applications
 * @desc Get applications with filtering
 * @access Private - Both brands and influencers can access their own applications
 */
router.get('/', authenticate, getApplications);

/**
 * @route GET /api/applications/:id
 * @desc Get application by ID
 * @access Private - Both brands and influencers can access their own applications
 */
router.get('/:id', authenticate, getApplicationById);

/**
 * @route POST /api/applications
 * @desc Create a new application
 * @access Private - Influencers only
 */
router.post('/', authenticate, authorize([UserType.INFLUENCER]), createApplication);

/**
 * @route PUT /api/applications/:id/status
 * @desc Update application status
 * @access Private - Brands only
 */
router.put('/:id/status', authenticate, authorize([UserType.BRAND]), updateApplicationStatus);

/**
 * @route PUT /api/applications/:id/rate-influencer
 * @desc Rate an influencer
 * @access Private - Brands only
 */
router.put('/:id/rate-influencer', authenticate, authorize([UserType.BRAND]), rateInfluencer);

/**
 * @route PUT /api/applications/:id/rate-brand
 * @desc Rate a brand
 * @access Private - Influencers only
 */
router.put('/:id/rate-brand', authenticate, authorize([UserType.INFLUENCER]), rateBrand);

export default router; 