"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config"));
if (!config_1.default.stripe.secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required');
}
const stripe = new stripe_1.default(config_1.default.stripe.secretKey, {
    apiVersion: '2025-09-30.clover',
});
exports.default = stripe;
//# sourceMappingURL=stripe.js.map