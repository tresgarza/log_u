import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import campaignRoutes from './campaign.routes';
import applicationRoutes from './application.routes';
import qrcodeRoutes from './qrcode.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/applications', applicationRoutes);
router.use('/qrcodes', qrcodeRoutes);

// Route to check if API is running
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router; 