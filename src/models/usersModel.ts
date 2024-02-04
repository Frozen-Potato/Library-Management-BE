import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  avatar: String,
  phoneNumber: String,
  password: String,
})

export default mongoose.model('User', userSchema)
