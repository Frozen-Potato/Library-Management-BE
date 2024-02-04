import { type Request, type Response } from 'express'

export function routeNotFound(_: Request, res: Response): void {
  res.status(404).json({ message: 'Route Not Found.' })
}
