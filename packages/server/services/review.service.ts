import { type Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

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
      //Create a prompt and insert contect dynamically ``.
      const prompt = `
        Summarize the following customer reviews into a short paragraph
        highlinting key themes, both positive and negative: 

        ${joinedReviews}
      `;
      //use the client to create a summary.Send the reviews to a LLM, by just calling llClient from client.ts
      const response = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      return response.text;

      /*      //To test hardcode a summary. Than replaced with the response.output
      const summary = 'This is a placeholder summary, to test.'; */
   },
};
