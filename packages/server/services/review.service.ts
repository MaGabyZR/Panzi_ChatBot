import { type Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      //call the repository to get the reviws.
      return reviewRepository.getReviews(productId);
   },

   //Define a new method to summarize reviews.
   async summarizeReviews(productId: number): Promise<string> {
      //Get the latest reviews (ex. the last 10)
      const reviews = await reviewRepository.getReviews(productId, 10);
      //Join the reviews in a string to send to an LLM. '\n\n' to separate and format the string.
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      //Send the reviews to a LLM

      //To test hardcode a summary.
      const summary = 'This is a placeholder summary, to test.';
      return summary;
   },
};
