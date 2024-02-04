import { type NextFunction } from 'express'
import BooksService from '../../services/booksService.js'
import { booksData, populatedBookData } from '../mockData/booksData.js'
import bookController from '../../controllers/bookController.js'
import { ApiError } from '../../utils/ApiError.js'

describe('Book Controller Test', () => {
  let req: any
  let res: any
  let next: NextFunction

  beforeEach(() => {
    req = {
      body: jest.fn(),
      params: jest.fn(),
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    next = jest.fn() as NextFunction
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllBooks', () => {
    const getAllBookMock = jest.spyOn(BooksService, 'getAll')

    it('Should return all books', async () => {
      const books = populatedBookData
      getAllBookMock.mockResolvedValue(books)

      await bookController.getAllBooks(req, res)

      const result = {
        data: books,
        page: 1,
        perPage: 3,
        totalCount: 3,
        totalPageCount: 1,
      }

      expect(getAllBookMock).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(result)
    })
  })

  describe('getOneBooks', () => {
    const getOneBookMock = jest.spyOn(BooksService, 'getOneById')
    const book = populatedBookData[0]
    const bookId = String(book.id)
    getOneBookMock.mockResolvedValue(book)

    it('Should return a book', async () => {
      req.params = {
        id: bookId,
      }
      await bookController.getBookById(req, res, next)

      expect(getOneBookMock).toHaveBeenCalledWith(bookId)
      expect(res.json).toHaveBeenCalledWith(book)
    })

    it('Should call next with an error if book not found', async () => {
      req.params = {
        id: bookId,
      }
      const errorResuult = null
      const error = ApiError.notFound('Book not found.')
      getOneBookMock.mockResolvedValue(errorResuult)

      await bookController.getBookById(req, res, next)

      expect(getOneBookMock).toHaveBeenCalledWith(bookId)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getOneBooksWithISBN', () => {
    const getOneBookMock = jest.spyOn(BooksService, 'getOneByISBN')
    const book = populatedBookData[0]
    const ISBN = book.ISBN
    getOneBookMock.mockResolvedValue(book)

    it('Should return a book', async () => {
      req.params = {
        ISBN,
      }
      await bookController.getBookByISBN(req, res, next)

      expect(getOneBookMock).toHaveBeenCalledWith(ISBN)
      expect(res.json).toHaveBeenCalledWith(book)
    })

    it('Should call next with an error if book not found', async () => {
      req.params = {
        ISBN,
      }
      const errorResuult = null
      const error = ApiError.notFound('Book not found.')
      getOneBookMock.mockResolvedValue(errorResuult)

      await bookController.getBookByISBN(req, res, next)

      expect(getOneBookMock).toHaveBeenCalledWith(ISBN)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createNewBook', () => {
    const createNewBookMock = jest.spyOn(BooksService, 'createOne')

    it('should create a new book and return new book', async () => {
      const newBook = booksData[0]
      createNewBookMock.mockResolvedValue(newBook)
      req.body = newBook

      await bookController.createNewBook(req, res, next)
      expect(createNewBookMock).toHaveBeenCalledWith(newBook)
      expect(res.json).toHaveBeenCalledWith(newBook)
    })
  })
})
