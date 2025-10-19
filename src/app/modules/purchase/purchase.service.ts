import httpStatus from 'http-status';
import prisma from '../../lib/prisma';
import ApiError from '../../errors/ApiError';
import { referralService } from '../referral/referral.service';
import stripe from '../../lib/stripe';

interface ICreatePurchase {
  userId: string;
  productId: string;
  amount: number;
  paymentMethodId?: string; // Stripe payment method ID
}

interface ICreatePaymentIntent {
  userId: string;
  productId: string;
  amount: number;
  currency?: string;
}

interface IPurchaseHistory {
  userId: string;
  page?: number;
  limit?: number;
}

class PurchaseService {
  // Create purchase and handle referral credits
  async createPurchase(payload: ICreatePurchase) {
    const { userId, productId, amount } = payload;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Use referral service to process purchase and award credits
    const result = await referralService.processPurchase(payload);

    return {
      purchase: result.purchase,
      creditsAwarded: result.creditsAwarded,
      isFirstPurchase: result.isFirstPurchase,
      message: result.isFirstPurchase 
        ? `Purchase successful! You earned ${result.creditsAwarded} credits.`
        : 'Purchase successful!',
    };
  }

  // Get purchase history
  async getPurchaseHistory(payload: IPurchaseHistory) {
    const { userId, page = 1, limit = 10 } = payload;
    const skip = (page - 1) * limit;

    const purchases = await prisma.purchase.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: {
        purchaseDate: 'desc',
      },
      include: {
        referral: {
          include: {
            referrer: {
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

    const total = await prisma.purchase.count({
      where: { userId },
    });

    return {
      purchases,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get purchase by ID
  async getPurchaseById(purchaseId: string, userId: string) {
    const purchase = await prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        userId,
      },
      include: {
        referral: {
          include: {
            referrer: {
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

    if (!purchase) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
    }

    return purchase;
  }

  // Get purchase statistics
  async getPurchaseStats(userId: string) {
    const stats = await prisma.purchase.aggregate({
      where: { userId },
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
    });

    const firstPurchase = await prisma.purchase.findFirst({
      where: { userId },
      orderBy: {
        purchaseDate: 'asc',
      },
    });

    const lastPurchase = await prisma.purchase.findFirst({
      where: { userId },
      orderBy: {
        purchaseDate: 'desc',
      },
    });

    return {
      totalPurchases: stats._count.id || 0,
      totalSpent: stats._sum.amount || 0,
      averagePurchaseAmount: stats._avg.amount || 0,
      firstPurchaseDate: firstPurchase?.purchaseDate || null,
      lastPurchaseDate: lastPurchase?.purchaseDate || null,
    };
  }

  // Get all purchases (admin only)
  async getAllPurchases(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const purchases = await prisma.purchase.findMany({
      skip,
      take: limit,
      orderBy: {
        purchaseDate: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        referral: {
          include: {
            referrer: {
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

    const total = await prisma.purchase.count();

    return {
      purchases,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Simulate purchase (for testing/demo purposes)
  async simulatePurchase(userId: string, productName: string, amount: number) {
    const productId = `PROD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return await this.createPurchase({
      userId,
      productId,
      amount,
    });
  }

  // Create Stripe Payment Intent
  async createPaymentIntent(payload: ICreatePaymentIntent) {
    const { userId, productId, amount, currency = 'usd' } = payload;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId,
        productId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  // Confirm Stripe Payment and process purchase
  async confirmPayment(paymentIntentId: string, userId: string) {
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment not completed');
    }

    // Verify the payment belongs to the user
    if (paymentIntent.metadata.userId !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Payment does not belong to user');
    }

    // Create purchase record
    const purchase = await this.createPurchase({
      userId,
      productId: paymentIntent.metadata.productId,
      amount: paymentIntent.amount / 100, // Convert back from cents
    });

    return {
      purchase: purchase.purchase,
      creditsAwarded: purchase.creditsAwarded,
      isFirstPurchase: purchase.isFirstPurchase,
      paymentIntent,
      message: 'Payment confirmed and purchase processed successfully!',
    };
  }

  // Create customer in Stripe (for future use)
  async createStripeCustomer(userId: string, email: string, name?: string) {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Store Stripe customer ID in user record (you might want to add this field to your schema)
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { stripeCustomerId: customer.id },
    // });

    return customer;
  }

  // Get payment methods for a user
  async getPaymentMethods(userId: string) {
    // This would require storing stripeCustomerId in user schema
    // For now, return empty array
    return [];
  }
}

export const purchaseService = new PurchaseService();
