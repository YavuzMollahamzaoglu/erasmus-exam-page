// Backend'de kullanmak için helper function
import prisma from "../prismaClient";

export const ensureConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection lost, reconnecting...", error);
    await prisma.$connect();
    return true;
  }
};

export const withRetry = async (fn: Function, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await ensureConnection();
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
