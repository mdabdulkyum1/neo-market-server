"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        // If stack is a JSON string, treat it as error data
        if (stack && stack.startsWith('{')) {
            try {
                this.errorData = JSON.parse(stack);
                Error.captureStackTrace(this, this.constructor);
            }
            catch (e) {
                this.stack = stack;
            }
        }
        else if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map