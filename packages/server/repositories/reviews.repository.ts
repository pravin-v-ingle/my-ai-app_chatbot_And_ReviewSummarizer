import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient, type Review } from '../generated/prisma/client';
import dayjs from 'dayjs';
const adapter = new PrismaMariaDb({
   host: process.env.DATABASE_HOST,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASSWORD,
   database: process.env.DATABASE_NAME,
   connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });
export const reviewRepository = {
   getReviews(productId: number, limit?: number) {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   async storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();
      const data = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId,
      };
      await prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },
};
