import dotenv from 'dotenv'

import app from './app.js'
import connectToMongoDB from './mongoose.js'

dotenv.config()

const PORT =
  process.env.PORT != null && process.env.PORT !== '' ? process.env.PORT : 8080

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.log('Error starting the server: ', error)
  })
