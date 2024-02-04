import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId

const CartSchema = new Schema({
  user_id: {
    type: ObjectId,
    ref: 'User',
  },
})

export default mongoose.model('Cart', CartSchema)
