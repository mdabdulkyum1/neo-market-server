"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const parseBodyData = async (req, res, next) => {
    if (req.body && req.body.bodyData) {
        try {
            req.body = await JSON.parse(req.body.bodyData);
        }
        catch (error) {
            return next(new ApiError_1.default(400, "Invalid JSON format in bodyData"));
        }
    }
    next();
};
exports.default = parseBodyData;
//# sourceMappingURL=parseBodyData.js.map