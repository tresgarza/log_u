import User, { UserType, UserStatus } from './user.model';
import Campaign, { CampaignStatus } from './campaign.model';
import CampaignApplication, { ApplicationStatus } from './campaign-application.model';
import QRCode, { QRCodeStatus } from './qrcode.model';

// Define all model associations
const defineAssociations = () => {
  // Campaign associations
  Campaign.belongsTo(User, {
    foreignKey: 'brandId',
    as: 'brand'
  });

  Campaign.hasMany(CampaignApplication, {
    foreignKey: 'campaignId',
    as: 'campaignApplications'
  });

  Campaign.hasMany(QRCode, {
    foreignKey: 'campaignId',
    as: 'qrCodes'
  });

  // Application associations
  CampaignApplication.belongsTo(Campaign, {
    foreignKey: 'campaignId',
    as: 'campaign'
  });

  CampaignApplication.belongsTo(User, {
    foreignKey: 'influencerId',
    as: 'influencer'
  });

  // QR code associations
  QRCode.belongsTo(Campaign, {
    foreignKey: 'campaignId',
    as: 'campaignDetails'
  });

  QRCode.belongsTo(User, {
    foreignKey: 'influencerId',
    as: 'qrCodeOwner'
  });

  // User associations
  User.hasMany(Campaign, {
    foreignKey: 'brandId',
    as: 'ownedCampaigns'
  });

  User.hasMany(CampaignApplication, {
    foreignKey: 'influencerId',
    as: 'influencerApplications'
  });

  User.hasMany(QRCode, {
    foreignKey: 'influencerId',
    as: 'generatedQRCodes'
  });
};

// Call the function to define associations
defineAssociations();

// Export the models
export {
  User,
  UserType,
  UserStatus,
  Campaign,
  CampaignStatus,
  CampaignApplication,
  ApplicationStatus,
  QRCode,
  QRCodeStatus
};

// Export default models object
export default {
  User,
  Campaign,
  CampaignApplication,
  QRCode
};