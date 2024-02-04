import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserRoleSchema = new Schema({
  user_id: { type: ObjectId, ref: 'User' },
  role_id: { type: ObjectId, ref: 'Role' },
})

UserRoleSchema.index({ user_id: 1, role_id: 1 }, { unique: true })

export default mongoose.model('UserRole', UserRoleSchema)
