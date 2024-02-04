export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for Library Management System',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from MongoDB database and returns it as JSON.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}
