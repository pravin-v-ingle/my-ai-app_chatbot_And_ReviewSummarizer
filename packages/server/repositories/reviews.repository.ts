import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient, type Review } from '../generated/prisma/client';
const adapter = new PrismaMariaDb({
   host: process.env.DATABASE_HOST,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASSWORD,
   database: process.env.DATABASE_NAME,
   connectionLimit: 5,
});
export const reviewRepository = {
   getReviews(productId: number) {
      const prisma = new PrismaClient({ adapter });
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};
