import { type Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      //call the repository to get the reviws.
      return reviewRepository.getReviews(productId);
   },

   //Define a new method to summarize reviews.
   async summarizeReviews(productId: number): Promise<string> {
      //Check if there is already a summary for the given product.
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary && existingSummary.expiresAt > new Date()) {
         return existingSummary.content;
      }

      //Get the latest reviews (ex. the last 10)
      const reviews = await reviewRepository.getReviews(productId, 10);
      //Join the reviews in a string to send to an LLM. '\n\n' to separate and format the string.
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      //Call prompt from the txt file and replace with the joinedReviews.
      const prompt = template.replace('{{reviews}}', joinedReviews);

      //use the client to create a summary.Send the reviews to a LLM, by just calling llClient from client.ts
      const { text: summary } = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      //store in the db before returning it.
      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;

      /*      //To test hardcode a summary. Than replaced with the response.output
      const summary = 'This is a placeholder summary, to test.'; */
   },
};
