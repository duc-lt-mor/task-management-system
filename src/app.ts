import express from 'express';
import { config } from 'dotenv';
config();
import router  from './Routers/routers';
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;

app.use('/', router)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
