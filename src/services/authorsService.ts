import mongoose from 'mongoose'

import AuthorRepo from '../models/authorsModel.js'
import { type Author } from '../types/Author.js'

async function getAll(): Promise<Author[]> {
  const authors = await AuthorRepo.find().exec()
  return authors as Author[]
}

async function getOne(authorId: string): Promise<Author | null | Error> {
  try {
    const id = new mongoose.Types.ObjectId(authorId)
    const author = await AuthorRepo.findById(id)
    return author as Author | null
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function createOne(
  payload: Partial<Author>
): Promise<Author | undefined | boolean> {
  const firstName = payload.firstName
  const lastName = payload.lastName
  const existingAuthor = await AuthorRepo.findOne({ firstName, lastName })
  if (existingAuthor === null) {
    const newAuthor = new AuthorRepo(payload)
    const res = await newAuthor.save()
    return res as Author | undefined
  }
  return false
}

async function deleteOne(authorId: string): Promise<boolean | Error> {
  try {
    const id = new mongoose.Types.ObjectId(authorId)
    const author = await AuthorRepo.findById(id)
    if (!(author instanceof Error || author === null)) {
      await author.deleteOne()
      return true
    }
    return false
  } catch (e) {
    const err = e as Error
    return err
  }
}

async function updateOne(
  authorId: string,
  payload: Partial<Author>
): Promise<Author | null | Error> {
  try {
    const id = new mongoose.Types.ObjectId(authorId)
    const filter = { _id: id }
    const updatedAuthor = await AuthorRepo.findOneAndUpdate(filter, payload, {
      new: true,
    })
    return updatedAuthor as Author | null
  } catch (e) {
    const err = e as Error
    return err
  }
}

export default { getAll, getOne, createOne, deleteOne, updateOne }
