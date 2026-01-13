import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productRepository } from '../repositories/product.repository';
import { reviewRepository } from '../repositories/review.repository';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      //Read the productID.
      const productId = Number(req.params.id);

      //Validate the product ID.
      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID.' });
         return;
      }
      //Call the repository to check if we have a product by this Id.
      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(404).json({ error: 'Product does not exist.' });
         return;
      }
      //Call the repository directly to get the reviews and put them in the response.
      const reviews = await reviewRepository.getReviews(productId);
      //Get the summary
      const summary = await reviewRepository.getReviewSummary(productId);

      res.json({
         summary,
         reviews,
      });
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
      //Call the repository to check if it is a valid product.
      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(400).json({ error: 'Invalid Product.' });
         return;
      }
      //Call the repository for a valid productId but with no reviews.
      const reviews = await reviewRepository.getReviews(productId, 1);
      if (!reviews.length) {
         res.status(400).json({ error: 'There are no reviews to summarize.' });
         return;
      }
      //Call the review service to get the summary and put it in the response.
      const summary = await reviewService.summarizeReviews(productId);
      //wrap the response inside an object {} to have a property called summary with the actual summaries of the reviews.It is better tha just returning a string.
      res.json({ summary });
   },
};
