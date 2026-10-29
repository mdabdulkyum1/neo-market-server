import prisma from "../../lib/prisma";
import { IPostSmsPayload } from "./sms.interface";
import { extractOtp, normalizePhone } from "./sms.utils";

const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes expiry

// Delegate reference to avoid IDE language server caching errors
const smsOtpModel = (prisma as any).smsOtp;

/**
 * Removes all expired SMS OTP records from the database
 */
const cleanupExpiredSms = async (): Promise<number> => {
  try {
    const result = await smsOtpModel.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error("Failed to clean up expired SMS records:", error);
    return 0;
  }
};

/**
 * Starts a background interval to auto-delete expired SMS OTPs every 30 seconds
 */
export const startSmsCleanupJob = () => {
  const timer = setInterval(async () => {
    try {
      await cleanupExpiredSms();
    } catch (error) {
      // silently handle
    }
  }, 30 * 1000);

  return () => clearInterval(timer);
};

/**
 * Saves incoming SMS into DB and extracts OTP with a 2-minute expiration
 */
const postSmsIntoDB = async (payload: IPostSmsPayload) => {
  const { phone, body, sender, otp: explicitOtp } = payload;

  if (!phone || !body) {
    throw new Error("Phone and body are required");
  }

  // 1. Clean up globally expired OTPs
  await cleanupExpiredSms();

  // 2. Remove any previous OTPs for this phone number so only the newest OTP is kept
  const normalized = normalizePhone(phone);
  try {
    await smsOtpModel.deleteMany({
      where: {
        OR: [
          { phone },
          { phone: normalized },
        ],
      },
    });
  } catch (err) {
    // Continue even if delete fails
  }

  // 3. Extract OTP from SMS text body
  const extractedOtp = extractOtp(body, explicitOtp);

  // 4. Set expiration to 2 minutes from now
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  // 5. Save the new SMS OTP in DB
  const record = await smsOtpModel.create({
    data: {
      phone: phone.trim(),
      body: body.trim(),
      sender: sender ? sender.trim() : null,
      otp: extractedOtp,
      expiresAt,
    },
  });

  return record;
};

/**
 * Retrieves the latest unexpired OTP for a given phone number
 */
const getSmsFromDB = async (phone: string) => {
  if (!phone) {
    return null;
  }

  // 1. Clean up expired OTPs
  await cleanupExpiredSms();

  const cleanPhone = phone.trim();
  const normalized = normalizePhone(cleanPhone);
  const now = new Date();

  // 2. Fetch active records
  const activeRecords = await smsOtpModel.findMany({
    where: {
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3. Find matching record by exact or normalized phone
  const matched = (activeRecords as any[]).find((item) => {
    if (item.phone === cleanPhone) return true;
    const itemNorm = normalizePhone(item.phone);
    if (itemNorm === normalized) return true;
    if (itemNorm.length >= 10 && normalized.length >= 10) {
      return itemNorm.endsWith(normalized) || normalized.endsWith(itemNorm);
    }
    return false;
  });

  return matched || null;
};

export const SmsServices = {
  postSmsIntoDB,
  getSmsFromDB,
  cleanupExpiredSms,
  startSmsCleanupJob,
};
