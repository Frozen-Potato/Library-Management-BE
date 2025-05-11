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
    schemas: {
      User: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
          },
          lasName: {
            type: 'string',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          address: {
            type: 'string',
          },
          avatar: {
            type: 'string',
          },
          phoneNumber: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      Book: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          ISBN: { type: 'string' },
          title: { type: 'string' },
          edition: { type: 'string' },
          category: {
            type: 'string',
            description: 'ObjectId referencing Category',
          },
          description: { type: 'string' },
          publisher: { type: 'string' },
          img: { type: 'string' },
          author: {
            type: 'array',
            items: {
              type: 'string',
              description: 'ObjectId referencing Author',
            },
          },
        },
      },
      BookBorrowHistory: {
        type: 'object',
        properties: {
          history: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                borrowedDate: {
                  type: 'string',
                  format: 'date-time',
                },
                returnedDate: {
                  type: 'string',
                  format: 'date-time',
                },
                returned: {
                  type: 'boolean',
                },
                book: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    title: { type: 'string' },
                    img: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
