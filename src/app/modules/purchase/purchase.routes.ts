import express from 'express';
import { PurchaseController } from './purchase.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { purchaseValidation } from './purchase.validation';

const router = express.Router();

// Create purchase (protected route)
router.post(
  '/',
  auth(),
  validateRequest(purchaseValidation.createPurchase),
  PurchaseController.createPurchase
);

// Simulate purchase (protected route)
router.post(
  '/simulate',
  auth(),
  validateRequest(purchaseValidation.simulatePurchase),
  PurchaseController.simulatePurchase
);

// Get purchase history (protected route)
router.get(
  '/history',
  auth(),
  PurchaseController.getPurchaseHistory
);

// Get purchase by ID (protected route)
router.get(
  '/:id',
  auth(),
  PurchaseController.getPurchaseById
);

// Get purchase statistics (protected route)
router.get(
  '/stats/overview',
  auth(),
  PurchaseController.getPurchaseStats
);

// Get all purchases (admin only - protected route)
router.get(
  '/admin/all',
  auth(),
  PurchaseController.getAllPurchases
);

// Stripe Payment Routes
router.post(
  '/payment-intent',
  auth(),
  validateRequest(purchaseValidation.createPaymentIntent),
  PurchaseController.createPaymentIntent
);

router.post(
  '/confirm-payment',
  auth(),
  validateRequest(purchaseValidation.confirmPayment),
  PurchaseController.confirmPayment
);

export const PurchaseRouters = router;
