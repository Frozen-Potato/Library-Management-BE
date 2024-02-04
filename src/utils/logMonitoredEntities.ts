import { type Request } from 'express'

export const logMonitoredEntities = (
  req: Request,
  originalPath: string,
  monitoredEntities: Record<string, { route: string; logMessage: string }>
): void => {
  Object.entries(monitoredEntities).forEach(([entity, config]) => {
    if (originalPath.includes(config.route)) {
      console.log(
        `[${new Date().toISOString()}] ${config.logMessage}`,
        req.body
      )
    }
  })
}
