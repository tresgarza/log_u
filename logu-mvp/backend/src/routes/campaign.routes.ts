import { Router } from 'express';
import { 
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getBrandDashboardStats,
  getCampaignMetrics
} from '../controllers/campaign.controller';
import { getCampaignQRCodes } from '../controllers/qrcode.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserType } from '../models';

const router = Router();

/**
 * @route GET /api/campaigns
 * @desc Get all campaigns with filtering
 * @access Public
 */
router.get('/', getCampaigns);

/**
 * @route GET /api/campaigns/:id
 * @desc Get campaign by ID
 * @access Public
 */
router.get('/:id', getCampaign);

/**
 * @route POST /api/campaigns
 * @desc Create a new campaign
 * @access Private - Brands only
 */
router.post('/', authenticate, authorize([UserType.BRAND]), createCampaign);

/**
 * @route PUT /api/campaigns/:id
 * @desc Update a campaign
 * @access Private - Brands only (own campaigns)
 */
router.put('/:id', authenticate, authorize([UserType.BRAND]), updateCampaign);

/**
 * @route DELETE /api/campaigns/:id
 * @desc Delete a campaign
 * @access Private - Brands only (own campaigns)
 */
router.delete('/:id', authenticate, authorize([UserType.BRAND]), deleteCampaign);

// QR code related routes for campaigns
router.get(
  '/:campaignId/qrcodes',
  authenticate,
  getCampaignQRCodes
);

// Get brand dashboard stats
router.get('/stats/dashboard', authenticate, authorize([UserType.BRAND]), getBrandDashboardStats);

/**
 * @route GET /api/campaigns/:id/metrics
 * @desc Get campaign metrics
 * @access Private
 */
router.get('/:id/metrics', authenticate, getCampaignMetrics);

export default router; 