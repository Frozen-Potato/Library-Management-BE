import mongoose from 'mongoose'

const { Schema } = mongoose

const roleSchema = new Schema({
  title: String,
})

export default mongoose.model('Role', roleSchema)
