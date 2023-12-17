import { type NextFunction, type Request, type Response } from 'express'
import BooksServices from '../services/booksService.js'
import { ApiError } from '../utils/ApiError.js'
import { type WithAuthRequest } from '../types/User.js'
import { convertedPaginationData } from '../utils/convertPaginationData.js'

const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const query = req.query
  const filterStatus = query.filter
  filterStatus === '1'
    ? await filterByQuery(req, res, next)
    : await getAllBooks(req, res)
}

const getAllBooks = async (_: Request, res: Response): Promise<void> => {
  const books = await BooksServices.getAll()
  res.json(convertedPaginationData(books))
}

const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id
  const book = await BooksServices.getOneById(id)

  if (book instanceof Error) {
    next(ApiError.badRequest('Bad request.', book.message))
    return
  }

  if (book === null) {
    next(ApiError.notFound('Book not found.'))
    return
  }

  res.json(book)
}

const getBookByISBN = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const ISBN = req.params.ISBN
  const book = await BooksServices.getOneByISBN(ISBN)

  if (book === null) {
    next(ApiError.notFound('Book not found.'))
    return
  }

  if (book instanceof Error) {
    next(ApiError.badRequest('Bad request.', book.message))
    return
  }

  res.json(book)
}

const getAllBookCopies = async (_: Request, res: Response): Promise<void> => {
  const books = await BooksServices.getAllCopies()
  res.json(books)
}

const getBookCopiesWithBookId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookId = req.params.id
  const books = await BooksServices.getCopiesByBookId(bookId)
  res.json(books)
}

const filterByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const query = req.query
  const result = await BooksServices.getFilteredBook(query)

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  const { data, page, perPage, totalCount } = result

  res.status(200).json(convertedPaginationData(data, page, perPage, totalCount))
}

const createNewBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body
  const result = await BooksServices.createOne(body)
  result === undefined
    ? next(ApiError.badRequest('Bad request.'))
    : res.status(201).json(result)
}

// const createCopies = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const books = await BooksServices.getAll()
//   if (books.length > 0) {
//     books.forEach(async (book) => {
//       await BooksServices.createOneCopy(String(book._id))
//     })
//   }
//   res.sendStatus(200)
// }

const createNewCopy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id
  const result = await BooksServices.createOneCopy(id)
  result === undefined
    ? next(ApiError.badRequest('Bad request.'))
    : res.status(201).json(result)
}

const updateBookInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id
  const body = req.body
  const result = await BooksServices.updateOne(id, body)

  if (result === null) {
    next(ApiError.notFound('Book not found.'))
    return
  }

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  res.status(201).json(result)
}

const borrowBookById = async (
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.body.id
  const result = await BooksServices.updateMultiAvailableStatus(
    req.decoded?.userId as string,
    id,
    false
  )

  if (result === false) {
    next(ApiError.notFound('Book not available to borrow'))
    return
  }

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  if (result === true) {
    res.sendStatus(200)
    return
  }

  res.status(404).json(result)
}

const returnBookById = async (
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.body.id
  const result = await BooksServices.updateMultiAvailableStatus(
    req.decoded?.userId as string,
    id,
    true
  )

  if (result === false) {
    next(ApiError.notFound('Book not available to return'))
    return
  }

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  if (result === true) {
    res.sendStatus(200)
    return
  }

  res.status(404).json(result)
}

const deleteBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id

  const result = await BooksServices.deleteOne(id)

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  if (!result) {
    next(ApiError.notFound('Book not found.'))
    return
  }

  res.sendStatus(204)
}

const getUserBorrowHistory = async (
  req: WithAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const decoded = req.decoded
  const userId = decoded?.userId as string
  const result = await BooksServices.getHistory(userId)

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  if (result === undefined) {
    res.json({ history: [] })
    return
  }

  res.json(result)
}

export default {
  getBooks,
  getAllBooks,
  getBookById,
  getBookByISBN,
  getAllBookCopies,
  getBookCopiesWithBookId,
  getUserBorrowHistory,
  filterByQuery,
  // createCopies,
  createNewBook,
  createNewCopy,
  updateBookInfo,
  borrowBookById,
  returnBookById,
  deleteBookById,
}
