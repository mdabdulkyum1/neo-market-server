"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError2 = void 0;
const handleZodError2 = (err) => {
    const messageParts = [];
    const errorDetails = {
        issues: err.issues.map((issue) => {
            const path = issue.path[issue.path.length - 1];
            const safePath = typeof path === "symbol" ? String(path) : path;
            const msg = issue.message === "Expected number, received string"
                ? `${safePath} ${issue.message}`
                : issue.message;
            messageParts.push(msg);
            return {
                path: safePath,
                message: issue.message,
            };
        }),
    };
    return {
        statusCode: 400,
        message: messageParts.join(". "),
        errorDetails,
    };
};
exports.handleZodError2 = handleZodError2;
// handleZodError corrected
const handleZodError = (error) => {
    const errors = error.issues.map((issue) => {
        const path = issue.path[issue.path.length - 1];
        const safePath = typeof path === "symbol" ? String(path) : path;
        return {
            path: safePath,
            message: issue.message,
        };
    });
    return {
        statusCode: 400,
        message: "Validation Error",
        errorMessages: errors,
    };
};
exports.default = handleZodError;
//# sourceMappingURL=handleZodError.js.map