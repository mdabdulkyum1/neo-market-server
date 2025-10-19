import httpStatus from 'http-status';
import prisma from '../../lib/prisma';
import { Role } from '@prisma/client';
import { IPaginationOptions } from '../../interface/pagination.type';
import { paginationHelper } from '../../helpers/paginationHelper';
import ApiError from '../../errors/ApiError';

class UserService {
  // Get user profile
  async getMyProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        referralCode: true,
        credits: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    return user;
  }

  // Get user profile by ID
  async getUserProfileById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        referralCode: true,
        credits: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  // Get all users with pagination
  async getAllUsers(options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    const users = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.USER, Role.ADMIN],
        },
      },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        referralCode: true,
        credits: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.user.count({
      where: {
        role: {
          in: [Role.USER, Role.ADMIN],
        },
      },
    });

    return {
      meta: {
        total,
        page,
        totalPage: Math.ceil(total / limit),
        limit,
      },
      data: users,
    };
  }

  // Update user profile
  async updateMyProfile(userId: string, payload: any) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Only allow updating specific fields: name, email
    const updateData: any = {};

    if (payload.name !== undefined) {
      updateData.name = payload.name;
    }

    if (payload.email !== undefined) {
      // Check if email is already taken by another user
      const emailExists = await prisma.user.findFirst({
        where: {
          email: payload.email,
          id: { not: userId },
        },
      });

      if (emailExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
      }

      updateData.email = payload.email;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        referralCode: true,
        credits: true,
        role: true,
        isEmailVerified: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  // Update user profile image
  async updateMyProfileImage(userId: string, payload: any, file: any) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (!existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Generate the new image URL if a file is provided
    const imageURL =
      file && file.originalname 
        ? `${payload.protocol}://${payload.host}/uploads/${file.filename}` 
        : existingUser.image;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageURL },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    return updatedUser;
  }

  // Get user dashboard data
  async getUserDashboard(userId: string) {
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
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Calculate referral statistics
    const totalReferredUsers = user.referralsGiven.length;
    const convertedUsers = user.referralsGiven.filter(
      referral => referral.status === 'CONVERTED'
    ).length;

    const referralLink = `${process.env.FRONTEND_URL}/register?r=${user.referralCode}`;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits,
        image: user.image,
      },
      dashboard: {
        totalReferredUsers,
        convertedUsers,
        totalCreditsEarned: user.dashboard?.totalCredits || 0,
        referralLink,
      },
      recentReferrals: user.referralsGiven.slice(0, 5).map(referral => ({
        id: referral.id,
        referredUser: referral.referred,
        status: referral.status,
        createdAt: referral.createdAt,
      })),
    };
  }

  // Get referral history
  async getReferralHistory(userId: string, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
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
        purchase: {
          select: {
            id: true,
            amount: true,
            purchaseDate: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.referral.count({
      where: { referrerId: userId },
    });

    return {
      meta: {
        total,
        page,
        totalPage: Math.ceil(total / limit),
        limit,
      },
      data: referrals,
    };
  }

  // Delete user (admin only)
  async deleteUser(userId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, image: true },
    });

    if (!existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id: userId },
      data: { 
        // Add soft delete field if needed in schema
        // isDeleted: true 
      },
    });

    return { message: 'User deleted successfully' };
  }
}

export const userService = new UserService();