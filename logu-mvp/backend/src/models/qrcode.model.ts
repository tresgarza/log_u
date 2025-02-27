import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User, Campaign } from '.';

export enum QRCodeStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export interface QRCodeAttributes {
  id: string;
  code: string;
  campaignId: number;
  influencerId: number;
  status: QRCodeStatus;
  usedAt?: Date;
  expiresAt: Date;
  redemptionValue: number;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface QRCodeCreationAttributes extends Optional<QRCodeAttributes, 'id' | 'createdAt' | 'updatedAt' | 'usedAt'> {}

class QRCode extends Model<QRCodeAttributes, QRCodeCreationAttributes> implements QRCodeAttributes {
  public id!: string;
  public code!: string;
  public campaignId!: number;
  public influencerId!: number;
  public status!: QRCodeStatus;
  public usedAt?: Date;
  public expiresAt!: Date;
  public redemptionValue!: number;
  public metadata?: Record<string, any>;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly campaign?: Campaign;
  public readonly influencer?: User;

  // Validation method for custom codes
  static validateCode(code: string): boolean {
    // Add your validation rules here
    // For example: only alphanumeric, minimum length, etc.
    return /^[A-Za-z0-9-_]{4,32}$/.test(code);
  }
}

QRCode.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isValid(value: string) {
          if (!QRCode.validateCode(value)) {
            throw new Error('Invalid QR code format. Code must be 4-32 characters long and contain only letters, numbers, hyphens, and underscores.');
          }
        }
      }
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
      type: DataTypes.ENUM(...Object.values(QRCodeStatus)),
      allowNull: false,
      defaultValue: QRCodeStatus.ACTIVE,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    redemptionValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'QRCode',
    tableName: 'qr_codes',
    indexes: [
      {
        unique: true,
        fields: ['code']
      }
    ]
  }
);

export default QRCode; 