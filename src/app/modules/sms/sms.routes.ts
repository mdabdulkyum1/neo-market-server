import { Router } from "express";
import { SmsControllers } from "./sms.controller";

const router = Router();

// POST and GET /post-sms (accepts body or query params, no auth/verification required)
router.post("/post-sms", SmsControllers.postSms);
router.get("/post-sms", SmsControllers.postSms);

// GET and POST /get-sms (polling endpoint by phone number, no auth required)
router.get("/get-sms", SmsControllers.getSms);
router.post("/get-sms", SmsControllers.getSms);

// Additional path aliases
router.post("/sms/post", SmsControllers.postSms);
router.get("/sms/get", SmsControllers.getSms);

export const SmsRouters = router;

