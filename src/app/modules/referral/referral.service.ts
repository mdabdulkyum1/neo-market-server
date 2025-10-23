import httpStatus from 'http-status';
import prisma from '../../lib/prisma';
import ApiError from '../../errors/ApiError';
import { sendReferralBonusEmails, sendReferralBonusEmail } from '../../utils/emailNotifications/referralNotificationService';

interface ICreateReferral {
  referrerId: string;
  referredId: string;
  referralCode: string;
}

interface IProcessPurchase {
  userId: string;
  productId: string;
  amount: number;
}

class ReferralService {
  // 🔹 Create referral relationship
  async createReferral(payload: ICreateReferral) {
    const { referrerId, referredId, referralCode } = payload;

    // Check if referral already exists
    const existingReferral = await prisma.referral.findUnique({
      where: {
        referrerId_referredId: {
          referrerId,
          referredId,
        },
      },
    });

    if (existingReferral) {
      throw new ApiError(httpStatus.CONFLICT, 'Referral already exists');
    }

    // Create referral record
    const referral = await prisma.referral.create({
      data: {
        referrerId,
        referredId,
        referralCode,
        status: 'PENDING',
      },
    });

    // Update referrer's dashboard
    await prisma.dashboard.update({
      where: { userId: referrerId },
      data: {
        referredUsers: { increment: 1 },
      },
    });

    return referral;
  }

  // 🔹 Process purchase and award credits
  async processPurchase(payload: IProcessPurchase) {
    const { userId, productId, amount } = payload;

    return await prisma.$transaction(async (tx) => {
      // Check if this is user's first purchase
      const existingPurchases = await tx.purchase.count({
        where: { userId },
      });

      const isFirstPurchase = existingPurchases === 0;

      // Create purchase record
      const purchase = await tx.purchase.create({
        data: {
          userId,
          productId,
          amount,
          isFirstPurchase,
        },
      });

      // If this is the first purchase, check for referral
      if (isFirstPurchase) {
        const referral = await tx.referral.findFirst({
          where: { referredId: userId },
        });

        if (referral && referral.status === 'PENDING') {
          const creditAmount = 2;

          // Update referral status + link the purchase via relation
          await tx.referral.update({
            where: { id: referral.id },
            data: {
              status: 'CONVERTED',
              convertedAt: new Date(),
              purchases: {
                connect: { id: purchase.id },
              },
            },
          });

          // Award credits
          await tx.user.update({
            where: { id: referral.referrerId },
            data: { credits: { increment: creditAmount } },
          });

          await tx.user.update({
            where: { id: userId },
            data: { credits: { increment: creditAmount } },
          });

          // Update dashboards
          await tx.dashboard.update({
            where: { userId: referral.referrerId },
            data: {
              convertedUsers: { increment: 1 },
              totalCredits: { increment: creditAmount },
            },
          });

          await tx.dashboard.update({
            where: { userId },
            data: {
              totalCredits: { increment: creditAmount },
            },
          });

          // Send emails asynchronously
          const [referrer, referred] = await Promise.all([
            tx.user.findUnique({
              where: { id: referral.referrerId },
              select: { email: true, name: true, referralCode: true },
            }),
            tx.user.findUnique({
              where: { id: userId },
              select: { email: true, name: true },
            }),
          ]);

          if (referrer && referred) {
            setImmediate(() => {
              sendReferralBonusEmails(
                referrer.email,
                referrer.name || 'User',
                referrer.referralCode,
                referred.email,
                referred.name || 'User',
                creditAmount
              ).catch((err) => console.error('Email error:', err));
            });
          }
        } else {
          // No referral — award signup bonus
          const signupBonus = 1;

          await tx.user.update({
            where: { id: userId },
            data: { credits: { increment: signupBonus } },
          });

          await tx.dashboard.update({
            where: { userId },
            data: { totalCredits: { increment: signupBonus } },
          });

          const user = await tx.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true, referralCode: true },
          });

          if (user) {
            setImmediate(() => {
              sendReferralBonusEmail({
                userEmail: user.email,
                userName: user.name || 'User',
                creditsEarned: signupBonus,
                referralCode: user.referralCode,
              }).catch((err) => console.error('Email error:', err));
            });
          }
        }
      }

      return {
        purchase,
        creditsAwarded: isFirstPurchase ? 2 : 0,
        isFirstPurchase,
      };
    });
  }

  // 🔹 Get referral stats
  async getReferralStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        dashboard: true,
        referralsGiven: {
          include: {
            referred: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
              },
            },
            purchases: {
              select: {
                id: true,
                amount: true,
                purchaseDate: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const totalReferred = user.referralsGiven.length;
    const convertedReferrals = user.referralsGiven.filter(
      (r) => r.status === 'CONVERTED'
    ).length;
    const pendingReferrals = totalReferred - convertedReferrals;

    const totalCreditsEarned = user.referralsGiven.reduce(
      (sum, r) => sum + (r.status === 'CONVERTED' ? 2 : 0),
      0
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits,
      },
      stats: {
        totalReferredUsers: totalReferred,
        convertedUsers: convertedReferrals,
        pendingUsers: pendingReferrals,
        totalCreditsEarned,
        conversionRate:
          totalReferred > 0
            ? (convertedReferrals / totalReferred) * 100
            : 0,
      },
      referralLink: `${process.env.FRONTEND_URL}/register?r=${user.referralCode}`,
    };
  }

  // 🔹 Validate referral code
  async validateReferralCode(referralCode: string) {
    const user = await prisma.user.findUnique({
      where: { referralCode },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        referralCode: true,
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid referral code');
    }

    return user;
  }

  // 🔹 Get leaderboard
  async getReferralLeaderboard(limit: number = 10) {
    const topReferrers = await prisma.dashboard.findMany({
      orderBy: [
        { totalCredits: 'desc' },
        { convertedUsers: 'desc' },
        { referredUsers: 'desc' },
      ],
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            referralCode: true,
          },
        },
      },
    });

    return topReferrers.map((dashboard, index) => ({
      rank: index + 1,
      user: dashboard.user,
      stats: {
        totalReferredUsers: dashboard.referredUsers,
        convertedUsers: dashboard.convertedUsers,
        totalCreditsEarned: dashboard.totalCredits,
        conversionRate:
          dashboard.referredUsers > 0
            ? (dashboard.convertedUsers / dashboard.referredUsers) * 100
            : 0,
      },
    }));
  }
}

export const referralService = new ReferralService();
