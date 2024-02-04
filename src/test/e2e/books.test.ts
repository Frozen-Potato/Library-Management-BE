import request from 'supertest'

import { booksData } from '../mockData/booksData.js'
import {
  BookModel as BookRepo,
  CopiesBookModel as CopiesBookRepo,
} from '../../models/bookModel.js'
import app from '../../app.js'
import connect, { type MongoHelper } from '../db-helper.js'

describe('Test book controller', () => {
  let mongoHelper: MongoHelper
  beforeAll(async () => {
    mongoHelper = await connect()

    for (const book of booksData) {
      const newBook = new BookRepo(book)
      await newBook.save()
    }
  })

  afterAll(async () => {
    await BookRepo.deleteMany({})
    await CopiesBookRepo.deleteMany({})
    await mongoHelper.closeDatabase()
  })

  describe('GET /books', () => {
    test('should respond with status code 200 and all books', async () => {
      const response = await request(app).get('/api/v1/books')
      const books = response.body.data

      expect(response.statusCode).toBe(200)
      expect(books.length).toBe(booksData.length)
    })
  })

  describe('GET /books/bookId', () => {
    test('should respond with status code 404 and an error message when the book does not exist', async () => {
      const response = await request(app).get(
        '/api/v1/books/655d13daf50dd1ceca878b48'
      )

      expect(response.statusCode).toBe(404)
      expect(response.body).toMatchObject({
        message: 'Book not found.',
      })
    })
  })

  describe('GET /books/ISBN', () => {
    test('should respond with status code 404 and an error message when the book does not exist', async () => {
      const response = await request(app).get('/api/v1/books/ISBN/0517682398')

      expect(response.statusCode).toBe(404)
      expect(response.body).toMatchObject({
        message: 'Book not found.',
      })
    })
  })
})
