import mongoose from 'mongoose'

const { Schema } = mongoose

const permissionSchema = new Schema({
  action: { type: String, unique: true },
})
const PermissionRepo = mongoose.model('Permission', permissionSchema)

export default PermissionRepo
