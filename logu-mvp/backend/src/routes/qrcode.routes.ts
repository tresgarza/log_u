import { Router } from 'express';
import { 
  generateQRCode, 
  getCampaignQRCodes, 
  getMyQRCodes,
  verifyQRCode,
  revokeQRCode,
  getDashboardStats
} from '../controllers/qrcode.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserType } from '../models';

const router = Router();

// Protected routes requiring authentication
router.post(
  '/',
  authenticate,
  authorize([UserType.BRAND]),
  generateQRCode
);

router.get(
  '/my',
  authenticate,
  authorize([UserType.INFLUENCER]),
  getMyQRCodes
);

router.post(
  '/verify',
  verifyQRCode
);

router.put(
  '/:id/revoke',
  authenticate,
  authorize([UserType.BRAND, UserType.INFLUENCER]),
  revokeQRCode
);

router.get(
  '/stats/dashboard',
  authenticate,
  authorize([UserType.INFLUENCER]),
  getDashboardStats
);

export default router; 