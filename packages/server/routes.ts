import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

//Route handler.
router.get('/', (req: Request, res: Response) => {
   res.send('Hello Monti!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello Panzi!' });
});

//Define a new endpoint for receiving prompts from the user.
router.post('/api/chat', chatController.sendMessage);

//Call the DB using Prisma to fetch all the reviews for a particular product.
router.get('/api/products/:id/reviews', reviewController.getReviews);

export default router;
