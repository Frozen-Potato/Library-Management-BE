import mongoose, { Schema } from 'mongoose'

const CategorySchema = new Schema({
  name: String,
})

const CategoryModel = mongoose.model('Category', CategorySchema)

export default CategoryModel
