import { type NextFunction, type Request, type Response } from 'express'

import { ApiError } from '../utils/ApiError.js'
import AuthorsService from '../services/authorsService.js'

async function getAllAuthors(_: Request, res: Response): Promise<void> {
  const authors = await AuthorsService.getAll()
  res.json(authors)
}

async function getAuthorById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorId = req.params.authorId
  const author = await AuthorsService.getOne(authorId)

  if (author === null) {
    next(ApiError.notFound('Author not found.'))
    return
  } else if (author instanceof Error) {
    next(ApiError.badRequest('Bad request.', author.message))
    return
  }

  res.json(author)
}

async function createNewAuthor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const body = req.body
  const result = await AuthorsService.createOne(body)

  if (result === false) {
    next(ApiError.badRequest('Bad request.', 'Author already existed.'))
    return
  } else if (result === undefined) {
    next(ApiError.internal('Something went wrong.'))
    return
  }

  res.status(201).json(result)
}

async function deleteAuthor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorId = req.params.authorId
  const result = await AuthorsService.deleteOne(authorId)

  if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  } else if (!result) {
    next(ApiError.notFound('Author not found.'))
    return
  }

  res.sendStatus(204)
}

async function updateAuthorInfo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorId = req.params.authorId
  const body = req.body
  const result = await AuthorsService.updateOne(authorId, body)

  if (result === null) {
    next(ApiError.notFound('Author not found.'))
    return
  } else if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  res.json(result)
}

export default {
  getAllAuthors,
  getAuthorById,
  createNewAuthor,
  deleteAuthor,
  updateAuthorInfo,
}
