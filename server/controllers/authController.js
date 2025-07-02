const jwt = require("jsonwebtoken")
const { User } = require("../models")

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body

    // Create new user (validation already handled by middleware)
    const user = new User({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
    })

    await user.save()

    // Generate JWT token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body

    // Find user by email or username
    const user = await User.findByEmailOrUsername(identifier.toLowerCase().trim())

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
        errors: [
          {
            field: "credentials",
            message: "No account found with these credentials",
          },
        ],
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
        errors: [
          {
            field: "credentials",
            message: "Password is incorrect",
          },
        ],
      })
    }

    // Generate JWT token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify JWT token and get user data
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account no longer exists",
        errors: [
          {
            field: "user",
            message: "This user account has been deleted",
          },
        ],
      })
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // For JWT, logout is handled client-side by removing the token
    // Here we can add token blacklisting logic if needed
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  login,
  verifyToken,
  logout,
}
