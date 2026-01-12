import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
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
};
