import { type NextFunction } from 'express'

import { ApiError } from '../../utils/ApiError.js'
import AuthorsController from '../../controllers/authorsController.js'
import AuthorsService from '../../services/authorsService.js'
import { authorsData } from '../mockData/authorsData.js'
import { type Author } from '../../types/Author.js'

describe('Authors Controller Test', () => {
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

  describe('getAllAuthors', () => {
    const getAllAuthorsMock = jest.spyOn(AuthorsService, 'getAll')

    test('should return all authors', async () => {
      const authors = authorsData
      getAllAuthorsMock.mockResolvedValue(authors as Author[])

      await AuthorsController.getAllAuthors(req, res)

      expect(getAllAuthorsMock).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(authors)
    })
  })

  describe('getAuthorById', () => {
    const getAuthorByIdMock = jest.spyOn(AuthorsService, 'getOne')
    const author = authorsData[0]
    const authorId = String(author._id)

    getAuthorByIdMock.mockResolvedValue(author as Author)

    test('should return an author', async () => {
      req.params = {
        authorId,
      }
      await AuthorsController.getAuthorById(req, res, next)

      expect(getAuthorByIdMock).toHaveBeenCalledWith(authorId)
      expect(res.json).toHaveBeenCalledWith(author)
    })

    test('should call next with an error if author not found', async () => {
      req.params = {
        authorId,
      }
      const errorResult = null
      const error = ApiError.notFound('Author not found.')
      getAuthorByIdMock.mockResolvedValue(errorResult)

      await AuthorsController.getAuthorById(req, res, next)

      expect(getAuthorByIdMock).toHaveBeenCalledWith(authorId)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createNewAuthor', () => {
    const createNewAuthorMock = jest.spyOn(AuthorsService, 'createOne')
    const author = authorsData[0]
    createNewAuthorMock.mockResolvedValue(author as Author)

    test('should return the result of a new author', async () => {
      const body = {
        firstName: author.firstName,
        lastName: author.lastName,
        books: author.books?.map((item) => String(item)),
      }
      req.body = body

      await AuthorsController.createNewAuthor(req, res, next)

      expect(createNewAuthorMock).toHaveBeenCalledWith(body)
      expect(res.json).toHaveBeenCalledWith(author)
    })
  })

  describe('updateAuthorInfo', () => {
    const updateAuthorInfoMock = jest.spyOn(AuthorsService, 'updateOne')
    const author = authorsData[0]
    const updatedAuthor = authorsData[1]
    const authorId = String(author._id)
    updateAuthorInfoMock.mockResolvedValue(updatedAuthor as Author)

    test('should update an author', async () => {
      req.params = {
        authorId,
      }

      const body = {
        lastName: updatedAuthor.lastName,
      }
      req.body = body

      await AuthorsController.updateAuthorInfo(req, res, next)

      expect(updateAuthorInfoMock).toHaveBeenCalledWith(authorId, body)
      expect(res.json).toHaveBeenCalledWith(updatedAuthor)
    })
  })
})
