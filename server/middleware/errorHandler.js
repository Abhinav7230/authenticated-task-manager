// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  console.error("Error:", err)

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found"
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message)
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token"
    error = { message, statusCode: 401 }
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token has expired"
    error = { message, statusCode: 401 }
  }

  // MongoDB connection errors
  if (err.name === "MongoNetworkError" || err.name === "MongooseServerSelectionError") {
    const message = "Database connection error"
    error = { message, statusCode: 503 }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`)
  res.status(404).json({
    success: false,
    message: error.message,
  })
}

module.exports = { errorHandler, notFound }
