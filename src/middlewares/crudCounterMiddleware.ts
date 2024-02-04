import { type NextFunction, type Request, type Response } from 'express'

import crudstatsService from '../services/crudstatsService.js'
import { httpMethodToCrudOperation } from '../utils/crudMapping.js'

export const crudCounterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const crudOperation = httpMethodToCrudOperation(req.method)

  res.on('finish', async () => {
    try {
      const isSuccess = res.statusCode >= 200 && res.statusCode < 300
      if (crudOperation !== null) {
        await crudstatsService.increment(crudOperation, isSuccess)
      }
    } catch (error) {
      console.error('Error in crudCounterMiddleware:', error)
    }
  })
  next()
}
