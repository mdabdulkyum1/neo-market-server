"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestArray = void 0;
const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
        });
        return next();
    }
    catch (err) {
        next(err);
    }
};
const validateRequestArray = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        return next();
    }
    catch (err) {
        next(err);
    }
};
exports.validateRequestArray = validateRequestArray;
exports.default = validateRequest;
//# sourceMappingURL=validateRequest.js.map