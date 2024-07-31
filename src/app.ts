import express from 'express';
import { config } from 'dotenv';
import router from './Routers/routers';
import * as swaggerUi from 'swagger-ui-express';
import { exceptionHandler } from './Middleware/ExceptionHandler';

config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;
app.use('/', router);
app.use(exceptionHandler);

// // Load the Swagger JSON file
const swaggerDocument = require('./Swagger/swagger-output.json');

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
