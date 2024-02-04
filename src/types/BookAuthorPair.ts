import type mongoose from 'mongoose'

interface BookAuthorPairDTO {
  book_id: mongoose.Types.ObjectId
  author_id: mongoose.Types.ObjectId
}

export type BookAuthorPair = BookAuthorPairDTO & { id: mongoose.Types.ObjectId }
