import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma/client';
import { da } from 'zod/locales';

const prisma = new PrismaClient();

//Our Repository only has data access code, the limit is to get only the latest reviews ex.10
export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      //Return reviews that we fetch from the DB all at once.
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   //Method for storing reviews. upsert is the combination of insert and update.
   storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();
      const data = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId,
      };

      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   //Add a new method to check if there is a summary for a given product.
   getReviewSummary(productId: number) {
      return prisma.summary.findUnique({
         where: { productId },
      });
   },
};
