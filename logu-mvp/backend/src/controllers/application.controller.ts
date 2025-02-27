import { Request, Response, NextFunction } from 'express';
import { CampaignApplication, ApplicationStatus, Campaign, User, UserType } from '../models';
import { ApiError } from '../middleware/error.middleware';

// Define a type for Campaign with proper associations
interface CampaignWithAssociations extends Campaign {
  brand?: User;
}

// Define a type for CampaignApplication with proper associations
interface CampaignApplicationWithAssociations extends CampaignApplication {
  Campaign?: CampaignWithAssociations;
}

/**
 * Get applications with filtering options
 * @route GET /api/applications
 */
export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.type;
    const { campaignId, status } = req.query;
    
    // Build filter conditions
    const whereConditions: any = {};
    
    if (campaignId) {
      whereConditions.campaignId = campaignId;
    }
    
    if (status && Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      whereConditions.status = status;
    }
    
    // If user is a brand, only show applications for their campaigns
    if (userType === UserType.BRAND && userId) {
      const campaigns = await Campaign.findAll({
        where: { brandId: userId },
        attributes: ['id']
      });
      
      const campaignIds = campaigns.map(campaign => campaign.id);
      whereConditions.campaignId = { $in: campaignIds };
    }
    
    // If user is an influencer, only show their applications
    if (userType === UserType.INFLUENCER && userId) {
      whereConditions.influencerId = userId;
    }
    
    // Get applications with related data
    const applications = await CampaignApplication.findAll({
      where: whereConditions,
      include: [
        {
          model: Campaign,
          include: [
            {
              model: User,
              as: 'brand',
              attributes: ['id', 'name', 'email', 'profileImage']
            }
          ]
        },
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
        applications
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get application by ID
 * @route GET /api/applications/:id
 */
export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user?.id;
    const userType = req.user?.type;
    
    const application = await CampaignApplication.findByPk(applicationId, {
      include: [
        {
          model: Campaign,
          include: [
            {
              model: User,
              as: 'brand',
              attributes: ['id', 'name', 'email', 'profileImage']
            }
          ]
        },
        {
          model: User,
          as: 'influencer',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ]
    }) as CampaignApplicationWithAssociations | null;
    
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }
    
    // Verify user has permission to view this application
    if (
      userType === UserType.BRAND && 
      userId && 
      application.Campaign?.brand?.id !== userId
    ) {
      throw new ApiError(403, 'You do not have permission to view this application');
    }
    
    if (
      userType === UserType.INFLUENCER && 
      userId && 
      application.influencerId !== userId
    ) {
      throw new ApiError(403, 'You do not have permission to view this application');
    }
    
    return res.status(200).json({
      success: true,
      data: {
        application
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new application
 * @route POST /api/applications
 */
export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.type;
    
    // Validate that user is an influencer
    if (userType !== UserType.INFLUENCER) {
      throw new ApiError(403, 'Only influencers can apply to campaigns');
    }
    
    // Ensure userId exists
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }
    
    const { campaignId, message } = req.body;
    
    if (!campaignId) {
      throw new ApiError(400, 'Campaign ID is required');
    }
    
    // Check if campaign exists and is active
    const campaign = await Campaign.findByPk(campaignId);
    
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }
    
    if (campaign.status !== 'active') {
      throw new ApiError(400, 'You can only apply to active campaigns');
    }
    
    // Check if user already applied to this campaign
    const existingApplication = await CampaignApplication.findOne({
      where: {
        campaignId,
        influencerId: userId
      }
    });
    
    if (existingApplication) {
      throw new ApiError(400, 'You have already applied to this campaign');
    }
    
    // Create application
    const application = await CampaignApplication.create({
      campaignId,
      influencerId: userId, // Now we're sure userId exists
      status: ApplicationStatus.PENDING,
      message
    });
    
    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        application
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status (for brand)
 * @route PUT /api/applications/:id/status
 */
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user?.id;
    const userType = req.user?.type;
    
    // Validate that user is a brand
    if (userType !== UserType.BRAND) {
      throw new ApiError(403, 'Only brands can update application status');
    }
    
    // Ensure userId exists
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }
    
    const { status, brandFeedback } = req.body;
    
    if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      throw new ApiError(400, 'Valid status is required');
    }
    
    // Find application
    const application = await CampaignApplication.findByPk(applicationId, {
      include: [
        {
          model: Campaign,
          attributes: ['id', 'brandId']
        }
      ]
    }) as CampaignApplicationWithAssociations | null;
    
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }
    
    // Verify ownership of the campaign
    if (application.Campaign?.brandId !== userId) {
      throw new ApiError(403, 'You do not have permission to update this application');
    }
    
    // Update application
    await application.update({
      status,
      brandFeedback: brandFeedback || application.brandFeedback
    });
    
    return res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        application
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add influencer rating (for brand)
 * @route PUT /api/applications/:id/rate-influencer
 */
export const rateInfluencer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user?.id;
    const userType = req.user?.type;
    
    // Validate that user is a brand
    if (userType !== UserType.BRAND) {
      throw new ApiError(403, 'Only brands can rate influencers');
    }
    
    // Ensure userId exists
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }
    
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError(400, 'Valid rating between 1 and 5 is required');
    }
    
    // Find application
    const application = await CampaignApplication.findByPk(applicationId, {
      include: [
        {
          model: Campaign,
          attributes: ['id', 'brandId']
        }
      ]
    }) as CampaignApplicationWithAssociations | null;
    
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }
    
    // Verify ownership of the campaign
    if (application.Campaign?.brandId !== userId) {
      throw new ApiError(403, 'You do not have permission to rate this influencer');
    }
    
    // Check if application is completed
    if (application.status !== ApplicationStatus.COMPLETED) {
      throw new ApiError(400, 'You can only rate completed applications');
    }
    
    // Update application with rating
    await application.update({
      influencerRating: rating
    });
    
    return res.status(200).json({
      success: true,
      message: 'Influencer rated successfully',
      data: {
        application
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add brand rating (for influencer)
 * @route PUT /api/applications/:id/rate-brand
 */
export const rateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user?.id;
    const userType = req.user?.type;
    
    // Validate that user is an influencer
    if (userType !== UserType.INFLUENCER) {
      throw new ApiError(403, 'Only influencers can rate brands');
    }
    
    // Ensure userId exists
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }
    
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError(400, 'Valid rating between 1 and 5 is required');
    }
    
    // Find application
    const application = await CampaignApplication.findByPk(applicationId);
    
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }
    
    // Verify user is the applicant
    if (application.influencerId !== userId) {
      throw new ApiError(403, 'You do not have permission to rate this brand');
    }
    
    // Check if application is completed
    if (application.status !== ApplicationStatus.COMPLETED) {
      throw new ApiError(400, 'You can only rate completed applications');
    }
    
    // Update application with rating
    await application.update({
      brandRating: rating
    });
    
    return res.status(200).json({
      success: true,
      message: 'Brand rated successfully',
      data: {
        application
      }
    });
  } catch (error) {
    next(error);
  }
}; 