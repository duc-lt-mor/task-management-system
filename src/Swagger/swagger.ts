const swaggerAutogen = require('swagger-autogen')
const doc = {
    info: {
      title: 'My API',
      description: 'Description',
    },
    host: 'localhost:3000',
    schemes: ['http'],
  };
  const outputFile = './Swagger/swagger-output.json';
  const endpointsFiles = ['./src/app.ts'];
  swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated.');
  });