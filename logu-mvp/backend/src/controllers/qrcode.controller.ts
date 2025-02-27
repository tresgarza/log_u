import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { User, Campaign, QRCode as QRCodeModel, QRCodeStatus, UserType, CampaignStatus } from '../models';
import { ApiError } from '../middleware/error.middleware';
import sequelize from '../config/database';
import db from '../config/database';

/**
 * Generate a new QR code for an influencer in a campaign
 * @route POST /api/qrcodes
 */
export const generateQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { campaignId, influencerId, redemptionValue, expiresAt, code, metadata } = req.body;

    // Validate required fields
    if (!campaignId || !influencerId || !redemptionValue || !expiresAt) {
      throw new ApiError(400, 'Missing required fields');
    }

    // Validate campaign exists and belongs to the brand
    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        brandId: req.user?.id
      }
    });

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found or unauthorized');
    }

    // Validate influencer exists
    const influencer = await User.findOne({
      where: {
        id: influencerId,
        type: 'influencer'
      }
    });

    if (!influencer) {
      throw new ApiError(404, 'Influencer not found');
    }

    // Generate or validate QR code
    let qrCode = code;
    if (!qrCode) {
      // If no code provided, generate a unique one
      qrCode = uuidv4().substring(0, 8).toUpperCase();
    } else if (!QRCodeModel.validateCode(qrCode)) {
      throw new ApiError(400, 'Invalid QR code format');
    }

    // Check if code already exists
    const existingCode = await QRCodeModel.findOne({
      where: { code: qrCode }
    });

    if (existingCode) {
      throw new ApiError(400, 'QR code already exists');
    }

    // Create QR code
    const newQRCode = await QRCodeModel.create({
      code: qrCode,
      campaignId,
      influencerId,
      status: QRCodeStatus.ACTIVE,
      expiresAt: new Date(expiresAt),
      redemptionValue,
      metadata: metadata || {}
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        qrCode: newQRCode
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get QR codes for a campaign
 * @route GET /api/campaigns/:campaignId/qrcodes
 */
export const getCampaignQRCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.type;
    const campaignId = req.params.campaignId;
    
    // Ensure userId exists
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }
    
    // Find campaign
    const campaign = await Campaign.findByPk(campaignId);
    
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }
    
    // Check permissions
    if (userType === UserType.BRAND && campaign.brandId !== userId) {
      throw new ApiError(403, 'You do not have permission to view QR codes for this campaign');
    }
    
    // Build query based on user type
    const whereConditions: any = { campaignId };
    
    // If user is an influencer, only show their QR codes
    if (userType === UserType.INFLUENCER) {
      whereConditions.influencerId = userId;
    }
    
    // Get QR codes
    const qrCodes = await QRCodeModel.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'influencer',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: {
        qrCodes
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get QR codes for the authenticated influencer
 * @route GET /api/qrcodes/my
 */
export const getMyQRCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    
    if (!user) {
      throw new ApiError(401, 'Not authenticated');
    }
    
    console.log(`getMyQRCodes called by user: ${user.id}, type: ${user.type}`);
    
    // Use raw query to avoid Sequelize issues
    const query = `
      SELECT 
        qr.id, qr.code, qr."campaignId" as "campaignId", qr."influencerId" as "influencerId", qr.status,
        qr."usedAt" as "usedAt", qr."expiresAt" as "expiresAt", qr."redemptionValue" as "redemptionValue", qr.metadata,
        qr."createdAt" as "createdAt", qr."updatedAt" as "updatedAt",
        c.id as "campaignDetails.id", c.name as "campaignDetails.name",
        c."startDate" as "campaignDetails.startDate", c."endDate" as "campaignDetails.endDate",
        c.status as "campaignDetails.status",
        u.id as "campaignDetails.brand.id", u.name as "campaignDetails.brand.name"
      FROM 
        qr_codes qr
      LEFT JOIN 
        campaigns c ON qr."campaignId" = c.id
      LEFT JOIN 
        users u ON c."brandId" = u.id
      WHERE 
        qr."influencerId" = :influencerId
      ORDER BY 
        qr."createdAt" DESC
    `;
    
    // Execute the query
    const qrCodes = await sequelize.query(query, {
      replacements: { influencerId: user.id },
      type: 'SELECT'
    }) as unknown as Record<string, any>[] | [Record<string, any>[]];
    
    // Process results to format them correctly and parse redemptionValue as number
    type QRCodeRecord = Record<string, any>;
    let formattedQRCodes: QRCodeRecord[] = [];
    
    // Ensure we're working with a flat array of records
    const records = Array.isArray(qrCodes[0]) ? qrCodes[0] : qrCodes;
    
    formattedQRCodes = records.map((qr: QRCodeRecord) => {
      // Create the base QR code object
      const formattedQR: QRCodeRecord = {
        id: qr.id,
        code: qr.code,
        campaignId: qr.campaignId,
        influencerId: qr.influencerId,
        status: qr.status,
        usedAt: qr.usedAt,
        expiresAt: qr.expiresAt,
        redemptionValue: parseFloat(qr.redemptionValue) || 0,
        metadata: qr.metadata,
        createdAt: qr.createdAt,
        updatedAt: qr.updatedAt
      };

      // Add campaign details if they exist
      if (qr['campaignDetails.id']) {
        formattedQR.campaignDetails = {
          id: qr['campaignDetails.id'],
          name: qr['campaignDetails.name'],
          startDate: qr['campaignDetails.startDate'],
          endDate: qr['campaignDetails.endDate'],
          status: qr['campaignDetails.status']
        };

        // Add brand details if they exist
        if (qr['campaignDetails.brand.id']) {
          formattedQR.campaignDetails.brand = {
            id: qr['campaignDetails.brand.id'],
            name: qr['campaignDetails.brand.name']
          };
        }
      }

      return formattedQR;
    });

    // Log the first QR code for debugging
    if (formattedQRCodes.length > 0) {
      console.log('First QR code:', JSON.stringify(formattedQRCodes[0], null, 2));
    }

    res.status(200).json({
      success: true,
      data: {
        qrCodes: formattedQRCodes
      }
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    next(error);
  }
};

/**
 * Verify and redeem a QR code
 * @route POST /api/qrcodes/verify
 */
export const verifyQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    
    // Validate code
    if (!code) {
      throw new ApiError(400, 'QR code is required');
    }
    
    // Find QR code
    const qrCode = await QRCodeModel.findOne({
      where: {
        code
      },
      include: [
        {
          model: Campaign,
          as: 'campaign'
        },
        {
          model: User,
          as: 'influencer',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ]
    });
    
    if (!qrCode) {
      throw new ApiError(404, 'QR code not found');
    }
    
    // Check if QR code is already used
    if (qrCode.status === QRCodeStatus.USED) {
      throw new ApiError(400, 'QR code has already been used');
    }
    
    // Check if QR code is expired
    if (qrCode.status === QRCodeStatus.EXPIRED || new Date() > qrCode.expiresAt) {
      // Update status if it's not already set to expired
      if (qrCode.status !== QRCodeStatus.EXPIRED) {
        await qrCode.update({ status: QRCodeStatus.EXPIRED });
      }
      throw new ApiError(400, 'QR code has expired');
    }
    
    // Check if QR code is revoked
    if (qrCode.status === QRCodeStatus.REVOKED) {
      throw new ApiError(400, 'QR code has been revoked');
    }
    
    // Check if campaign is still active
    if (qrCode.campaign?.status !== CampaignStatus.ACTIVE) {
      throw new ApiError(400, 'Campaign is no longer active');
    }
    
    // Update QR code status to used
    await qrCode.update({
      status: QRCodeStatus.USED,
      usedAt: new Date()
    });
    
    return res.status(200).json({
      success: true,
      message: 'QR code successfully verified and redeemed',
      data: {
        qrCode,
        influencer: qrCode.influencer,
        redemptionValue: qrCode.redemptionValue
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke a QR code
 * @route PUT /api/qrcodes/:id/revoke
 */
export const revokeQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const qrCodeId = req.params.id;
    const userId = req.user?.id;
    const userType = req.user?.type;
    
    // Ensure userId exists
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }
    
    // Find QR code
    const qrCode = await QRCodeModel.findByPk(qrCodeId, {
      include: [
        {
          model: Campaign,
          as: 'campaign'
        }
      ]
    });
    
    if (!qrCode) {
      throw new ApiError(404, 'QR code not found');
    }
    
    // Validate permissions
    if (userType === UserType.BRAND) {
      if (qrCode.campaign?.brandId !== userId) {
        throw new ApiError(403, 'You do not have permission to revoke this QR code');
      }
    } else if (userType === UserType.INFLUENCER) {
      if (qrCode.influencerId !== userId) {
        throw new ApiError(403, 'You do not have permission to revoke this QR code');
      }
    } else {
      throw new ApiError(403, 'Only brands and influencers can revoke QR codes');
    }
    
    // Validate that QR code is not already used
    if (qrCode.status === QRCodeStatus.USED) {
      throw new ApiError(400, 'Cannot revoke a QR code that has already been used');
    }
    
    // Update QR code status to revoked
    await qrCode.update({
      status: QRCodeStatus.REVOKED
    });
    
    return res.status(200).json({
      success: true,
      message: 'QR code successfully revoked',
      data: {
        qrCode
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get QR code statistics for influencer dashboard
 * @route GET /api/qrcodes/stats/dashboard
 */
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.type;
    
    // Validate that user is an influencer
    if (userType !== UserType.INFLUENCER) {
      throw new ApiError(403, 'Only influencers can access this endpoint');
    }
    
    // Ensure userId exists
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    // Get active QR codes count
    const activeQRCodes = await QRCodeModel.count({
      where: {
        influencerId: userId,
        status: QRCodeStatus.ACTIVE
      }
    });

    // Get total scans (used QR codes)
    const usedQRCodes = await QRCodeModel.findAll({
      where: {
        influencerId: userId,
        status: QRCodeStatus.USED
      },
      attributes: ['redemptionValue']
    });

    const totalScans = usedQRCodes.length;
    
    // Calculate total earnings
    const totalEarnings = usedQRCodes.reduce((sum, qr) => sum + Number(qr.redemptionValue), 0);

    // Calculate conversion rate
    const totalQRCodes = await QRCodeModel.count({
      where: {
        influencerId: userId
      }
    });

    const conversionRate = totalQRCodes > 0 ? (totalScans / totalQRCodes) * 100 : 0;

    return res.status(200).json({
      success: true,
      data: {
        activeQRCodes,
        totalScans,
        totalEarnings,
        conversionRate
      }
    });
  } catch (error) {
    next(error);
  }
}; 