import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

export class ValidationUtils {
  // Validate purchase amount
  static validateAmount(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be a valid number');
    }
    if (amount <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be greater than 0');
    }
    if (amount > 1000000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Amount cannot exceed 1,000,000');
    }
  }

  // Validate product ID
  static validateProductId(productId: string): void {
    if (!productId || typeof productId !== 'string') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product ID is required');
    }
    if (productId.trim().length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product ID cannot be empty');
    }
    if (productId.length > 100) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product ID is too long');
    }
  }

  // Validate user ID
  static validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User ID is required');
    }
    if (userId.trim().length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User ID cannot be empty');
    }
  }

  // Validate pagination parameters
  static validatePagination(page?: number, limit?: number): { page: number; limit: number } {
    const validatedPage = Math.max(1, Math.floor(page || 1));
    const validatedLimit = Math.min(100, Math.max(1, Math.floor(limit || 10)));
    
    return { page: validatedPage, limit: validatedLimit };
  }

  // Validate referral code
  static validateReferralCode(referralCode: string): void {
    if (!referralCode || typeof referralCode !== 'string') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Referral code is required');
    }
    if (referralCode.trim().length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Referral code cannot be empty');
    }
    if (!referralCode.startsWith('REF')) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid referral code format');
    }
  }

  // Sanitize string input
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}

// Credit configuration constants
export const CREDIT_CONFIG = {
  REFERRAL_BONUS: 2,
  SIGNUP_BONUS: 1,
  MAX_CREDITS_PER_DAY: 100,
} as const;
