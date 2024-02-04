import request from 'supertest'
import CategoryRepo from '../../models/categoriesModel.js'
import { CategoryData } from '../mockData/booksData.js'
import app from '../../app.js'
import connect, { type MongoHelper } from '../db-helper.js'

describe('Test book controller', () => {
  let mongoHelper: MongoHelper
  beforeAll(async () => {
    mongoHelper = await connect()

    for (const category of CategoryData) {
      const newCate = new CategoryRepo(category)
      await newCate.save()
    }
  })

  afterAll(async () => {
    await CategoryRepo.deleteMany({})
    await mongoHelper.closeDatabase()
  })

  describe('GET /categories', () => {
    test('should respond with status code 200 and all categories', async () => {
      const response = await request(app).get('/api/v1/categories')
      const categories = response.body

      expect(response.statusCode).toBe(200)
      expect(categories.length).toBe(CategoryData.length)
    })
  })
})
