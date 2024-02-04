import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const BookAuthorSchema = new Schema({
  book_id: {
    type: ObjectId,
    ref: 'Book',
  },
  author_id: {
    type: ObjectId,
    ref: 'Author',
  },
})

export default mongoose.model('Book_Author', BookAuthorSchema)
