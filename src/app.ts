import express from 'express';
import { config } from 'dotenv';
import { router } from './Routers/routers';
import { exceptionHandler } from './Middleware/ExceptionHandler';
import fs from 'fs';
import path from 'path';
import * as swaggerUi from 'swagger-ui-express'

config();
const app = express();
const port = process.env.PORT;
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../Swagger/swagger-output.json'), 'utf8'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(`/api`, router);
app.use(exceptionHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

