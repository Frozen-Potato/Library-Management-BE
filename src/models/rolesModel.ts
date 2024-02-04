import mongoose from 'mongoose'

const { Schema } = mongoose

const roleSchema = new Schema({
  title: { type: String, unique: true },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
    },
  ],
})

const RoleRepo = mongoose.model('Role', roleSchema)

export default RoleRepo
