import CategoryRepo from '../models/categoriesModel.js'
import { type Category } from '../types/Category.js'

const getAll = async (): Promise<Category[]> => {
  const categories = await CategoryRepo.find().exec()
  return categories as Category[]
}

export default {
  getAll,
}
