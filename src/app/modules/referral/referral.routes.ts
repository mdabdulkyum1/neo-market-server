import express from 'express';
import { ReferralController } from './referral.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Get referral statistics (protected route)
router.get(
  '/stats',
  auth(),
  ReferralController.getReferralStats
);

// Validate referral code (public route)
router.get(
  '/validate/:referralCode',
  ReferralController.validateReferralCode
);

// Get referral leaderboard (public route)
router.get(
  '/leaderboard',
  ReferralController.getReferralLeaderboard
);

export const ReferralRouters = router;
