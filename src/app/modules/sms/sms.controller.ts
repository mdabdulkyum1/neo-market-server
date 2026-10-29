import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { SmsServices } from "./sms.service";

/**
 * Handle incoming SMS via POST (or GET)
 * Endpoint: /api/v1/post-sms
 * Accepts parameters from body or query: phone, body (or msg/message), sender, optional otp
 * Public endpoint - no verification / authentication required
 */
const postSms = catchAsync(async (req: Request, res: Response) => {
  const phone = (req.body?.phone || req.query?.phone) as string;
  const body = (req.body?.body || req.query?.body || req.body?.msg || req.query?.msg || req.body?.message || req.query?.message) as string;
  const sender = (req.body?.sender || req.query?.sender) as string | undefined;
  const otp = (req.body?.otp || req.query?.otp) as string | undefined;

  if (!phone || !body) {
    res.status(400).json({
      success: false,
      message: "Both 'phone' and 'body' parameters are required.",
    });
    return;
  }

  const result = await SmsServices.postSmsIntoDB({
    phone: String(phone),
    body: String(body),
    sender: sender ? String(sender) : undefined,
    otp: otp ? String(otp) : undefined,
  });

  res.status(200).json({
    success: true,
    message: "SMS received and OTP saved successfully (valid for 2 minutes).",
    otp: result.otp,
    phone: result.phone,
    body: result.body,
    sender: result.sender,
    expiresAt: result.expiresAt,
    data: result,
  });
});

/**
 * Handle OTP polling via GET (or POST)
 * Endpoint: /api/v1/get-sms?phone=...
 * Public endpoint - no verification / authentication required
 */
const getSms = catchAsync(async (req: Request, res: Response) => {
  const phone = (req.query?.phone || req.body?.phone) as string;

  if (!phone) {
    res.status(400).json({
      success: false,
      message: "'phone' parameter is required.",
      otp: null,
    });
    return;
  }

  const result = await SmsServices.getSmsFromDB(String(phone));

  if (!result || !result.otp) {
    res.status(200).json({
      success: false,
      message: "No active OTP found for this phone number or it has expired (over 2 minutes).",
      otp: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "OTP retrieved successfully.",
    otp: result.otp,
    phone: result.phone,
    body: result.body,
    sender: result.sender,
    expiresAt: result.expiresAt,
    createdAt: result.createdAt,
    data: result,
  });
});

export const SmsControllers = {
  postSms,
  getSms,
};

