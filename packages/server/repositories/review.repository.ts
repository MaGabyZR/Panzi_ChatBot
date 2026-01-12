import { PrismaClient, type Review } from '../generated/prisma/client';

//Our Repository only has data access code.
export const reviewRepository = {
   async getReviews(productId: number): Promise<Review[]> {
      const prisma = new PrismaClient();

      //Return reviews that we fetch from the DB all at once.
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};
