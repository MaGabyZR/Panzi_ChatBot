import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

//Streamline our environment variable.
dotenv.config();

//Create a new instance of OpenAI with our API Key.
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

//Define a route and a route handler.
//Route
const app = express();
//Return a middleware function that gets executed before passing the request to the request handler. If you do not pass it, the prompt request body is gping to be undefined.
app.use(express.json());
const port = process.env.PORT || 3000;

//Route handler.
app.get('/', (req: Request, res: Response) => {
   res.send('Hello Monti!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello Panzi!' });
});

//To be able to make follow up questions, but only for one user.
//let lastResponseId: string | null = null; //Replaced with a map.

//Map conversationId to lastReponseId
const conversations = new Map<string, string>();

//Define a new endpoint for receiving prompts from the user.
app.post('/api/chat', async (req: Request, res: Response) => {
   //1.grab the user´s prompt from the request, using destructuring. Make sure you passed the middleware function first. (Up) Ang get the conversationId from the body of the request.
   const { prompt, conversationId } = req.body;
   //2.Send to OpenAI
   const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
   });

   conversations.set(conversationId, response.id);

   //3. Return a json object to the client.
   res.json({ message: response.output_text });
});
//Start the webserver
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
