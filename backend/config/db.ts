import mongoose from 'mongoose'
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URL, "Url")
    const conn = await mongoose.connect(process.env.MONGO_URL as string, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error:any) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
