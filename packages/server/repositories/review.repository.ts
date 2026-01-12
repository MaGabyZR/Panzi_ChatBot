import { PrismaClient, type Review } from '../generated/prisma/client';

//Our Repository only has data access code, the limit is to get only the latest reviews ex.10
export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      const prisma = new PrismaClient();

      //Return reviews that we fetch from the DB all at once.
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },
};
