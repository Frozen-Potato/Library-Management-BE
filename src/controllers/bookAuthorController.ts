import { type NextFunction, type Request, type Response } from 'express'
import type mongoose from 'mongoose'

import BookAuthorService from '../services/bookAuthorService.js'
import { ApiError } from '../utils/ApiError.js'

async function getPairs(req: Request, res: Response): Promise<void> {
  let bookAuthorPairs
  if (req.query.book_id === undefined && req.query.author_id === undefined) {
    bookAuthorPairs = await BookAuthorService.getAll()
  } else {
    bookAuthorPairs = await BookAuthorService.getPairsById({
      book_id: req.query.book_id as string | undefined,
      author_id: req.query.author_id as string | undefined,
    })
  }

  res.json(bookAuthorPairs)
}

async function createNewPair(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const body = req.body
  const result = await BookAuthorService.createNewPair(body)

  res.status(201).json(result)
}

async function deletePairs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.query.book_id === undefined && req.query.author_id === undefined) {
    next(
      ApiError.badRequest(
        'Bad request.',
        'Missing book_id and/or author_id as query parameters.'
      )
    )
    return
  }

  const result = await BookAuthorService.deletePairs({
    book_id: req.query.book_id as string | undefined,
    author_id: req.query.author_id as string | undefined,
  })

  if (result === false) {
    next(ApiError.internal('Something went wrong.'))
    return
  }

  res.sendStatus(204)
}

async function updatePair(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.query.book_id === undefined || req.query.author_id === undefined) {
    next(
      ApiError.badRequest(
        'Bad request.',
        'Missing book_id and/or author_id as query parameters.'
      )
    )
    return
  }

  const body = req.body
  const result = await BookAuthorService.updatePair(
    {
      book_id: req.query.book_id as string | mongoose.Types.ObjectId,
      author_id: req.query.author_id as string | mongoose.Types.ObjectId,
    },
    body
  )

  if (result === null) {
    next(ApiError.notFound('Book-Author pair not found.'))
    return
  } else if (result instanceof Error) {
    next(ApiError.badRequest('Bad request.', result.message))
    return
  }

  res.json(result)
}

export default { getPairs, createNewPair, deletePairs, updatePair }
