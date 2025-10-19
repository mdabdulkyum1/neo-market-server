import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { purchaseService } from './purchase.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';

// Create purchase
const createPurchase = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const { productId, amount } = req.body;
  
  const data = await purchaseService.createPurchase({
    userId,
    productId,
    amount,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Purchase created successfully!',
    data: data,
  });
});

// Simulate purchase (for demo purposes)
const simulatePurchase = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const { productName, amount } = req.body;
  
  const data = await purchaseService.simulatePurchase(userId, productName, amount);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Purchase simulated successfully!',
    data: data,
  });
});

// Get purchase history
const getPurchaseHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const data = await purchaseService.getPurchaseHistory({
    userId,
    page,
    limit,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase history fetched successfully!',
    data: data,
  });
});

// Get purchase by ID
const getPurchaseById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const purchaseId = req.params.id;
  
  const data = await purchaseService.getPurchaseById(purchaseId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase details fetched successfully!',
    data: data,
  });
});

// Get purchase statistics
const getPurchaseStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const data = await purchaseService.getPurchaseStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase statistics fetched successfully!',
    data: data,
  });
});

// Get all purchases (admin only)
const getAllPurchases = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const data = await purchaseService.getAllPurchases(page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All purchases fetched successfully!',
    data: data,
  });
});

// Create Stripe Payment Intent
const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const { productId, amount, currency } = req.body;
  
  const data = await purchaseService.createPaymentIntent({
    userId,
    productId,
    amount,
    currency,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment intent created successfully!',
    data: data,
  });
});

// Confirm Stripe Payment
const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const { paymentIntentId } = req.body;
  
  const data = await purchaseService.confirmPayment(paymentIntentId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment confirmed and purchase processed successfully!',
    data: data,
  });
});

export const PurchaseController = {
  createPurchase,
  simulatePurchase,
  getPurchaseHistory,
  getPurchaseById,
  getPurchaseStats,
  getAllPurchases,
  createPaymentIntent,
  confirmPayment,
};
