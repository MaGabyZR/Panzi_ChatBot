import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { PrismaClient } from './generated/prisma/client';

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
router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   const prisma = new PrismaClient();
   const productId = Number(req.params.id);

   if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID.' });
      return;
   }

   const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
   });

   res.json(reviews);
});

export default router;
