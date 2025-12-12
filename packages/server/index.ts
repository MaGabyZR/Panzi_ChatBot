import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

//Configure our environment variable.
dotenv.config();

//Define a route and a route handler.
//1. Create the app
const app = express();
//2.Return a middleware function that gets executed before passing the request to the request handler. If you do not pass it, the prompt request body is gping to be undefined.
app.use(express.json());
//3. Add a router
app.use(router);

//Initialize the port.
const port = process.env.PORT || 3000;

//Start the webserver
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
