import { type NextFunction, type Request, type Response } from 'express'

export function loggingMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  console.log('👀 [INFO]: ', req.method, req.path)
  next()
}
