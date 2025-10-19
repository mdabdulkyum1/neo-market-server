import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { referralService } from './referral.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';

// Get referral statistics
const getReferralStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const data = await referralService.getReferralStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Referral statistics fetched successfully!',
    data: data,
  });
});

// Validate referral code
const validateReferralCode = catchAsync(async (req: Request, res: Response) => {
  const { referralCode } = req.params;
  const data = await referralService.validateReferralCode(referralCode);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Referral code validated successfully!',
    data: data,
  });
});

// Get referral leaderboard
const getReferralLeaderboard = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const data = await referralService.getReferralLeaderboard(limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Referral leaderboard fetched successfully!',
    data: data,
  });
});

export const ReferralController = {
  getReferralStats,
  validateReferralCode,
  getReferralLeaderboard,
};
