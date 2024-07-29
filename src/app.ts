import express from 'express';
import { config } from 'dotenv';
import { router } from './Routers/routers';
import { exceptionHandler } from './Middleware/ExceptionHandler';
config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/api`, router);
app.use(exceptionHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
