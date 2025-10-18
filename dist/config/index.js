"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "12",
    otp_expiry_time: process.env.OTP_ACCESS_EXPIRES_IN || "5",
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET,
        access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
        reset_pass_secret: process.env.JWT_RESET_PASS_SECRET
    },
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.EMAIL_PASSWORD,
        contact_mail_address: process.env.CONTACT_MAIL_ADDRESS,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }
};
//# sourceMappingURL=index.js.map