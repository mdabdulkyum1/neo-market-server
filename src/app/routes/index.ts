import express from "express";

const AuthRouters = "hello"

const router = express.Router();

const moduleRoutes = [
    {
        path:"/auth",
        route: AuthRouters,
    }
]


moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router

