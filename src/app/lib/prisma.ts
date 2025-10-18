import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  transactionOptions: {
    timeout: 10000, // 10 seconds
  },
});
export default prisma;

