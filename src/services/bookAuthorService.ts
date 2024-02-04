import mongoose from 'mongoose'

import BookAuthorRepo from '../models/bookAuthorModel.js'
import { type BookAuthorPair } from '../types/BookAuthorPair.js'

async function getAll(): Promise<BookAuthorPair[]> {
  const bookAuthorPairs = await BookAuthorRepo.find().exec()
  return bookAuthorPairs as BookAuthorPair[]
}

async function getPairsById(filter: {
  book_id: string | undefined | mongoose.Types.ObjectId
  author_id: string | undefined | mongoose.Types.ObjectId
}): Promise<BookAuthorPair[] | null | Error> {
  try {
    if (filter.book_id === undefined) {
      delete filter.book_id
    } else if (filter.author_id === undefined) {
      delete filter.author_id
    }

    const args = Object.entries(filter)
    for (const key of args) {
      key[1] = new mongoose.Types.ObjectId(key[1])
    }

    const authors = await BookAuthorRepo.find(Object.fromEntries(args)).exec()
    return authors as BookAuthorPair[] | null
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function createNewPair(
  payload: BookAuthorPair
): Promise<BookAuthorPair | undefined> {
  const newBookAuthorPair = new BookAuthorRepo(payload)
  const res = await newBookAuthorPair.save()
  return res as BookAuthorPair | undefined
}

async function deletePairs(filter: {
  book_id: string | mongoose.Types.ObjectId | undefined
  author_id: string | mongoose.Types.ObjectId | undefined
}): Promise<boolean | Error> {
  try {
    if (filter.book_id === undefined) {
      delete filter.book_id
    } else if (filter.author_id === undefined) {
      delete filter.author_id
    }

    const args = Object.entries(filter)
    for (const key of args) {
      key[1] = new mongoose.Types.ObjectId(key[1])
    }

    const res = await BookAuthorRepo.deleteMany(Object.fromEntries(args))
    return res.acknowledged as boolean
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function updatePair(
  filter: {
    book_id: string | mongoose.Types.ObjectId
    author_id: string | mongoose.Types.ObjectId
  },
  payload: Partial<BookAuthorPair>
): Promise<BookAuthorPair | null | Error> {
  try {
    const args = Object.entries(filter)
    for (const key of args) {
      key[1] = new mongoose.Types.ObjectId(key[1])
    }

    const updatedAuthor = await BookAuthorRepo.findOneAndUpdate(
      Object.fromEntries(args),
      payload,
      { new: true }
    )
    return updatedAuthor as BookAuthorPair | null
  } catch (e) {
    const err = e as Error
    return err
  }
}

export default {
  getAll,
  getPairsById,
  createNewPair,
  deletePairs,
  updatePair,
}
