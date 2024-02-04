import swaggerJsdoc from 'swagger-jsdoc'

import { swaggerDefinition } from '../../swaggerDef.js'

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
