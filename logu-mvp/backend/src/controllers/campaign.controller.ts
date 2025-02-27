import { Request, Response, NextFunction } from 'express';
import { Campaign, User, CampaignApplication, QRCode } from '../models';
import { ApiError } from '../utils/ApiError';
import { Op } from 'sequelize';
import sequelize from '../config/database';

/**
 * Get all campaigns with filtering options
 * @route GET /api/campaigns
 */
export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brandId, status } = req.query;
    const where: any = {};

    if (brandId) {
      where.brandId = brandId;
    }

    if (status) {
      where.status = status;
    }

    const campaigns = await Campaign.findAll({
      where,
      include: [
        {
          model: User,
          as: 'brand',
          attributes: ['id', 'name', 'email', 'website']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        campaigns
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get campaign by ID
 * @route GET /api/campaigns/:id
 */
export const getCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByPk(id, {
      include: [
        {
          model: User,
          as: 'brand',
          attributes: ['id', 'name', 'email', 'website']
        }
      ]
    });

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    res.status(200).json({
      success: true,
      data: {
        campaign
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new campaign
 * @route POST /api/campaigns
 */
export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaignData = req.body;
    
    // Set brandId from authenticated user
    if (!req.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }
    campaignData.brandId = req.user.id;

    const campaign = await Campaign.create(campaignData);

    res.status(201).json({
      success: true,
      data: {
        campaign
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update campaign
 * @route PUT /api/campaigns/:id
 */
export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    // Verify ownership if not admin
    if (req.user?.type !== 'admin' && campaign.brandId !== req.user?.id) {
      throw new ApiError(403, 'Not authorized to update this campaign');
    }

    await campaign.update(updates);

    res.status(200).json({
      success: true,
      data: {
        campaign
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete campaign
 * @route DELETE /api/campaigns/:id
 */
export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    // Verify ownership if not admin
    if (req.user?.type !== 'admin' && campaign.brandId !== req.user?.id) {
      throw new ApiError(403, 'Not authorized to delete this campaign');
    }

    await campaign.destroy();

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

interface QRCodeStats {
  total: string;
  used: string | null;
}

/**
 * Get brand dashboard statistics
 * @route GET /api/campaigns/stats/dashboard
 */
export const getBrandDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brandId = req.user?.id;

    if (!brandId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const [
      totalCampaigns,
      activeCampaigns,
      totalInfluencers,
      qrCodeStats
    ] = await Promise.all([
      Campaign.count({ where: { brandId } }),
      Campaign.count({ where: { brandId, status: 'active' } }),
      CampaignApplication.count({
        include: [{
          model: Campaign,
          as: 'campaign',
          where: { brandId },
          required: true
        }],
        where: { status: 'approved' }
      }),
      (QRCode.findAll({
        include: [{
          model: Campaign,
          as: 'campaignDetails',
          where: { brandId },
          required: true
        }],
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'used' THEN 1 ELSE 0 END")), 'used']
        ],
        raw: true
      }) as unknown) as Promise<QRCodeStats[]>
    ]);

    const stats = qrCodeStats[0] || { total: '0', used: '0' };
    const totalQRCodes = parseInt(stats.total, 10);
    const usedQRCodes = parseInt(stats.used || '0', 10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCampaigns,
          activeCampaigns,
          totalInfluencers,
          totalQRCodes,
          usedQRCodes,
          conversionRate: totalQRCodes > 0 ? (usedQRCodes / totalQRCodes) * 100 : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

interface QRCodeMetricsResult {
  total: string;
  used: string | null;
}

/**
 * Get campaign metrics
 * @route GET /api/campaigns/:id/metrics
 */
export const getCampaignMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    const [applications, qrCodeStats] = await Promise.all([
      CampaignApplication.count({ where: { campaignId: id } }),
      (QRCode.findAll({
        where: { campaignId: id },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'used' THEN 1 ELSE 0 END")), 'used']
        ],
        raw: true
      }) as unknown) as Promise<QRCodeMetricsResult[]>
    ]);

    const stats = qrCodeStats[0] || { total: '0', used: '0' };
    const totalQRCodes = parseInt(stats.total, 10);
    const usedQRCodes = parseInt(stats.used || '0', 10);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalApplications: applications,
          totalQRCodes,
          usedQRCodes,
          conversionRate: totalQRCodes > 0 ? (usedQRCodes / totalQRCodes) * 100 : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 