import { type NextFunction, type Request, type Response } from 'express'

import CrudStatsService from '../services/crudstatsService.js'
import { type CrudType } from '../types/CrudStats.js'
import { ApiError } from '../utils/ApiError.js'

async function getAllCrudStats(_: Request, res: Response): Promise<void> {
  const stats = await CrudStatsService.getAll()
  res.json(stats)
}

async function getOneCrudStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const crudType: CrudType = req.params.crudType as CrudType
  const allowedCrudTypes: CrudType[] = ['create', 'read', 'update', 'delete']

  if (!allowedCrudTypes.includes(crudType)) {
    next(
      ApiError.badRequest(
        `Only 'create', 'read', 'update', 'delete' are allowed`
      )
    )
    return
  }

  const stats = await CrudStatsService.getOne(crudType)

  if (stats instanceof Error) {
    next(ApiError.internal(stats.message))
    return
  }

  if (stats == null) {
    next(ApiError.notFound(`No stats found for ${crudType} operation`))
    return
  }

  res.json({ [crudType]: stats?.[crudType] })
}

export default {
  getAllCrudStats,
  getOneCrudStats,
}
