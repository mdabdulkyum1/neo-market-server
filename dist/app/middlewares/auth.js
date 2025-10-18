"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.checkOTP = void 0;
const config_1 = __importDefault(require("../../config"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../lib/prisma"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const headersAuth = req.headers.authorization;
            if (!headersAuth || !headersAuth.startsWith("Bearer ")) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid authorization format!");
            }
            const token = headersAuth?.split(' ')[1];
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_secret);
            if (!verifiedUser?.email) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
            }
            const { id } = verifiedUser;
            const user = await prisma_1.default.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
            }
            // if (user.isDeleted == true) {
            //   throw new ApiError(httpStatus.BAD_REQUEST, "This user is deleted ! ");
            // }
            // if (user.status === UserStatus.BLOCKED) {
            //   throw new ApiError(httpStatus.FORBIDDEN, 'Your account is blocked!');
            // }
            // if (user.status === UserStatus.INACTIVE) {
            //   throw new ApiError(httpStatus.BAD_REQUEST, 'Your account is not activated yet!');
            // }
            // if (user.status === UserStatus.PENDING) {
            //   throw new ApiError(httpStatus.BAD_REQUEST, 'Your account is not accepted yet!');
            // }
            req.user = verifiedUser;
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden! You are not authorized!");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
const checkOTP = async (req, res, next) => {
    try {
        const headersAuth = req.headers.authorization;
        if (!headersAuth || !headersAuth.startsWith("Bearer ")) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid authorization format!");
        }
        const token = headersAuth?.split(' ')[1];
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
        if (!verifiedUser?.id) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const { id } = verifiedUser;
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
        }
        req.user = verifiedUser;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.checkOTP = checkOTP;
const optionalAuth = (...roles) => {
    return async (req, res, next) => {
        try {
            const headersAuth = req.headers.authorization;
            const token = headersAuth?.split(' ')[1];
            if (!token) {
                // No token provided, proceed without authentication
                return next();
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_secret);
            if (!verifiedUser?.email) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
            }
            const { id } = verifiedUser;
            const user = await prisma_1.default.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
            }
            // if (user.status === UserStatus.BLOCKED) {
            //   throw new ApiError(httpStatus.FORBIDDEN, 'Your account is blocked!');
            // }
            req.user = verifiedUser;
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden!');
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.optionalAuth = optionalAuth;
exports.default = auth;
//# sourceMappingURL=auth.js.map