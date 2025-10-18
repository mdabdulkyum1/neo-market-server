"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    transactionOptions: {
        timeout: 10000, // 10 seconds
    },
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map