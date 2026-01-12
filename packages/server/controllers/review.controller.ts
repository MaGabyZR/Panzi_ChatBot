import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      //Read the productID.
      const productId = Number(req.params.id);

      //Validate the product ID.
      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID.' });
         return;
      }
      //Call the review service to get the reviews and put them in the response.
      const reviews = await reviewService.getReviews(productId);

      res.json(reviews);
   },

   //Method for handling request for summarizing reviews.
   async summarizeReviews(req: Request, res: Response) {
      //Read the productID.
      const productId = Number(req.params.id);

      //Validate the product ID.
      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID.' });
         return;
      }
      //Call the review service to get the summary and put it in the response.
      const summary = await reviewService.summarizeReviews(productId);
      //wrap the response inside an object {} to have a property called summary with the actual summaries of the reviews.It is better tha just returning a string.
      res.json({ summary });
   },
};
