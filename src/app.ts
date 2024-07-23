import express from 'express';
import { config } from 'dotenv';
import { router } from './Routers/routers';
config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/`, router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
