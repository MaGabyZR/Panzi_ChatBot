import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

//Streamline our environment variable.
dotenv.config();

//Define a route and a route handler.
//Route
const app = express();
const port = process.env.PORT || 3000;

//Route handler.
app.get('/', (req: Request, res: Response) => {
   res.send('Hello Monti!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello Panzi!' });
});

//Start the webserver
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
