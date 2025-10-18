"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data?.statusCode).json({
        success: data?.success || data?.statusCode < 400 ? true : false,
        statusCode: data?.statusCode,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
//# sourceMappingURL=sendResponse.js.map