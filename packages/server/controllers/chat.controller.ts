import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

//Call Zod for data validation schema.It is implementation detail.
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required.')
      .max(1000, 'Prompt is too long(max 1000 characters).'),
   conversationId: z.uuid(),
});
//Public Interface.
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      //validate incoming request data.
      const parseResult = chatSchema.safeParse(req.body);
      if (!parseResult.success) {
         res.status(400).json(parseResult.error.format());
         return;
      }
      //Handle errors.
      try {
         //1.grab the user´s prompt from the request, using destructuring. Make sure you passed the middleware function first. (Up) Ang get the conversationId from the body of the request.
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);
         //3. Return a json object to the client.
         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate a response.' });
      }
   },
};
