import { z } from 'zod';

const createPurchase = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    amount: z.number().positive('Amount must be positive'),
  }),
});

const simulatePurchase = z.object({
  body: z.object({
    productName: z.string().min(1, 'Product name is required'),
    amount: z.number().positive('Amount must be positive'),
  }),
});

const createPaymentIntent = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().optional().default('usd'),
  }),
});

const confirmPayment = z.object({
  body: z.object({
    paymentIntentId: z.string().min(1, 'Payment Intent ID is required'),
  }),
});

export const purchaseValidation = {
  createPurchase,
  simulatePurchase,
  createPaymentIntent,
  confirmPayment,
};
