import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';
import QRCode from './qrcode.model';
import CampaignApplication from './campaign-application.model';

// Campaign status types
export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Campaign attributes interface
export interface CampaignAttributes {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: CampaignStatus;
  brandId: number;
  objective?: string;
  targetAudience?: string;
  requirements?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Campaign model class
class Campaign extends Model<CampaignAttributes> implements CampaignAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
  public budget!: number;
  public status!: CampaignStatus;
  public brandId!: number;
  public objective?: string;
  public targetAudience?: string;
  public requirements?: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly brand?: User;
  public readonly applications?: CampaignApplication[];
  public readonly qrCodes?: QRCode[];
}

// Initialize Campaign model
Campaign.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CampaignStatus)),
      allowNull: false,
      defaultValue: CampaignStatus.DRAFT,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    objective: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    targetAudience: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Campaign',
    tableName: 'campaigns',
  }
);

export default Campaign; 