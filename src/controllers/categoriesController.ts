import { type Request, type Response } from 'express'
import categoriesService from '../services/categoriesService.js'

const getCategories = async (_: Request, res: Response): Promise<void> => {
  const result = await categoriesService.getAll()
  res.json(result)
}

export default {
  getCategories,
}
