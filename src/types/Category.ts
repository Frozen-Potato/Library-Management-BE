import type mongoose from 'mongoose'

export type Category = {
  id: mongoose.Types.ObjectId
  name: string
}
