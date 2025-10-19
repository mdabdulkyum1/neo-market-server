"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const Users_route_1 = require("../modules/user/Users.route");
const referral_routes_1 = require("../modules/referral/referral.routes");
const purchase_routes_1 = require("../modules/purchase/purchase.routes");
const email_routes_1 = require("../modules/email/email.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRouters,
    },
    {
        path: "/users",
        route: Users_route_1.UserRouters,
    },
    {
        path: "/referrals",
        route: referral_routes_1.ReferralRouters,
    },
    {
        path: "/purchases",
        route: purchase_routes_1.PurchaseRouters,
    },
    {
        path: "/email",
        route: email_routes_1.EmailRouters,
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map