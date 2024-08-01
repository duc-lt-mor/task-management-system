export const options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['src/Routers/routers.ts'],
};
