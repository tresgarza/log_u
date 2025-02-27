import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Application status types
export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Campaign Application attributes interface
export interface CampaignApplicationAttributes {
  id: number;
  campaignId: number;
  influencerId: number;
  status: ApplicationStatus;
  message?: string;
  compensation?: number;
  brandFeedback?: string;
  influencerRating?: number;
  brandRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Campaign Application creation attributes interface
export interface CampaignApplicationCreationAttributes extends Optional<CampaignApplicationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Campaign Application model class
class CampaignApplication extends Model<CampaignApplicationAttributes, CampaignApplicationCreationAttributes> implements CampaignApplicationAttributes {
  public id!: number;
  public campaignId!: number;
  public influencerId!: number;
  public status!: ApplicationStatus;
  public message?: string;
  public compensation?: number;
  public brandFeedback?: string;
  public influencerRating?: number;
  public brandRating?: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Campaign Application model
CampaignApplication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'campaigns',
        key: 'id',
      },
    },
    influencerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      allowNull: false,
      defaultValue: ApplicationStatus.PENDING,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    compensation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    brandFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    influencerRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    brandRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'campaign_applications',
    modelName: 'CampaignApplication',
  }
);

export default CampaignApplication; 