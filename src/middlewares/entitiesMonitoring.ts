import { type NextFunction, type Request, type Response } from 'express'

import monitoredEntities from '../configs/entitiesMonitorConfig.js'
import { logMonitoredEntities } from '../utils/logMonitoredEntities.js'

export const entitiesMonitorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store the original res.send function to maintain default behavior
  const originalSend = res.send
  const { path: originalPath, method } = req

  // Override the res.send function
  res.send = function (data?: any): Response {
    if (method === 'POST' && res.statusCode >= 200 && res.statusCode < 300) {
      logMonitoredEntities(req, originalPath, monitoredEntities)
    }

    // Call the original res.send function to send the response to the client
    return originalSend.call(this, data)
  }

  next()
}
