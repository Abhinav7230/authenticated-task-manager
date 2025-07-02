const jwt = require("jsonwebtoken")
const { User } = require("../models")

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    // Check if user still exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      })
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      user: user,
    }

    next()
  } catch (error) {
    console.error("Authentication error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = { authenticateToken }
