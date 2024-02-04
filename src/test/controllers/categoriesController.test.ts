import CategoriesService from '../../services/categoriesService.js'
import { CategoryData } from '../mockData/booksData.js'
import CategoriesController from '../../controllers/categoriesController.js'

describe('Category Controller Test', () => {
  let req: any
  let res: any

  beforeEach(() => {
    req = {
      body: jest.fn(),
      params: jest.fn(),
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllCategory', () => {
    const getAllCateMock = jest.spyOn(CategoriesService, 'getAll')
    it('Should return all categories', async () => {
      const cate = CategoryData
      getAllCateMock.mockResolvedValue(cate)

      await CategoriesController.getCategories(req, res)

      expect(getAllCateMock).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(cate)
    })
  })
})
