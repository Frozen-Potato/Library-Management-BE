import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const dbUrl = process.env.DB_URL as string

const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbUrl)
    console.log('Connected to MongoDB!')
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error)
  }
}

export default connectToMongoDB
