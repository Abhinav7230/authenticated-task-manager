const { User } = require("../models")

// Check if email already exists during signup
const checkEmailUnique = async (req, res, next) => {
  try {
    const { email } = req.body
    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
          errors: [
            {
              field: "email",
              message: "A user with this email already exists",
              value: email,
            },
          ],
        })
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}

// Check if username already exists during signup
const checkUsernameUnique = async (req, res, next) => {
  try {
    const { username } = req.body
    if (username) {
      const existingUser = await User.findOne({ username: username.toLowerCase() })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
          errors: [
            {
              field: "username",
              message: "A user with this username already exists",
              value: username,
            },
          ],
        })
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}

// Check uniqueness during profile update (excluding current user)
const checkProfileUpdateUnique = async (req, res, next) => {
  try {
    const { email, username } = req.body
    const userId = req.user.userId
    const errors = []

    if (email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      })
      if (existingEmail) {
        errors.push({
          field: "email",
          message: "A user with this email already exists",
          value: email,
        })
      }
    }

    if (username) {
      const existingUsername = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: userId },
      })
      if (existingUsername) {
        errors.push({
          field: "username",
          message: "A user with this username already exists",
          value: username,
        })
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkEmailUnique,
  checkUsernameUnique,
  checkProfileUpdateUnique,
}
