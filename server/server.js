const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")
const userRoutes = require("./routes/user")
const testRoutes = require("./routes/test")

const connectDB = require("./config/database")

const { errorHandler, notFound } = require("./middleware/errorHandler")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/user", userRoutes)
app.use("/api/test", testRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running!" })
})

app.use(notFound)

app.use(errorHandler)

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
