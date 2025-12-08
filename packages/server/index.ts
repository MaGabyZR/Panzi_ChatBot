import express from 'express';
import type { Request, Response } from 'express';

//Define a route and a route handler.
//Route
const app = express();
const port = process.env.PORT || 3000;

//Route handler.
app.get('/', (req: Request, res: Response) => {
   res.send('Thank you Monti!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello Panzi!' });
});

//Start the webserver
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
