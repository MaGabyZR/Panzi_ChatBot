import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';

//Streamline our environment variable.
dotenv.config();

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

//Define a new endpoint for receiving prompts from the user.
app.post('/api/chat', chatController.sendMessage);

//Start the webserver
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
