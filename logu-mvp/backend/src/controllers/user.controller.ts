import { Request, Response, NextFunction } from 'express';
import { User, UserType } from '../models';
import { ApiError } from '../utils/ApiError';

export const getInfluencers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const influencers = await User.findAll({
      where: {
        type: UserType.INFLUENCER,
        status: 'active'
      },
      attributes: ['id', 'name', 'email', 'bio'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        influencers
      }
    });
  } catch (error) {
    next(error);
  }
}; 