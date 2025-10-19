import express from "express";
import { AuthRouters } from "../modules/auth/auth.routes";
import { UserRouters } from "../modules/user/Users.route";
import { ReferralRouters } from "../modules/referral/referral.routes";
import { PurchaseRouters } from "../modules/purchase/purchase.routes";
import { EmailRouters } from "../modules/email/email.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path:"/auth",
        route: AuthRouters,
    },
    {
        path:"/users",
        route: UserRouters,
    },
    {
        path:"/referrals",
        route: ReferralRouters,
    },
    {
        path:"/purchases",
        route: PurchaseRouters,
    },
    {
        path:"/email",
        route: EmailRouters,
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router

