import type mongoose from 'mongoose'

export type CartItem = {
  cart_id: mongoose.Types.ObjectId
  books: mongoose.Types.ObjectId[]
}
