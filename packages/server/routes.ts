import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

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

export default router;
