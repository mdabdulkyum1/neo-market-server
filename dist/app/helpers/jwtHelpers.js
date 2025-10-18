"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });
    return token;
};
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        // Handle JWT-specific errors with proper status codes
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Access token has expired. Please login again.", JSON.stringify({
                name: "TokenExpiredError",
                message: "jwt expired",
                expiredAt: error.expiredAt,
                errorCode: "JWT_EXPIRED"
            }));
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid access token. Please login again.", JSON.stringify({
                name: "JsonWebTokenError",
                message: error.message,
                errorCode: "JWT_INVALID"
            }));
        }
        else if (error instanceof jsonwebtoken_1.NotBeforeError) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Token is not active yet.", JSON.stringify({
                name: "NotBeforeError",
                message: error.message,
                date: error.date,
                errorCode: "JWT_NOT_ACTIVE"
            }));
        }
        else {
            // Generic JWT error
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token. Please login again.", JSON.stringify({
                name: "JWTError",
                message: "Token verification failed",
                errorCode: "JWT_VERIFICATION_FAILED"
            }));
        }
    }
};
exports.jwtHelpers = {
    generateToken,
    verifyToken,
};
//# sourceMappingURL=jwtHelpers.js.map