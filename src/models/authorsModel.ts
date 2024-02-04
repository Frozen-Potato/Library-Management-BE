import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId

const AuthorSchema = new Schema({
  firstName: String,
  lastName: String,
  books: [
    {
      type: ObjectId,
      ref: 'Book',
    },
  ],
  image: String,
})

export default mongoose.model('Author', AuthorSchema)
