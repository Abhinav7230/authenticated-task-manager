const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL)

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected")
    })

    process.on("SIGINT", async () => {
      await mongoose.connection.close()
      console.log("MongoDB connection closed through app termination")
      process.exit(0)
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message)
    process.exit(1)
  }
}

module.exports = connectDB
