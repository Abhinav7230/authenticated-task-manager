const { body, param, query, validationResult } = require("express-validator")
const mongoose = require("mongoose")

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }))

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    })
  }
  next()
}

// Custom validators
const isValidObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Invalid ID format")
  }
  return true
}

const isStrongPassword = (value) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  if (value.length < 8) {
    throw new Error("Password must be at least 8 characters long")
  }
  if (value.length > 128) {
    throw new Error("Password cannot exceed 128 characters")
  }
  // Optional: Uncomment for stronger password requirements
  // if (!strongPasswordRegex.test(value)) {
  //   throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  // }
  return true
}

const isValidUsername = (value) => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(value)) {
    throw new Error("Username can only contain letters, numbers, and underscores")
  }
  if (value.length < 3) {
    throw new Error("Username must be at least 3 characters long")
  }
  if (value.length > 20) {
    throw new Error("Username cannot exceed 20 characters")
  }
  return true
}

const isValidPriority = (value) => {
  const validPriorities = ["low", "medium", "high"]
  if (!validPriorities.includes(value)) {
    throw new Error("Priority must be one of: low, medium, high")
  }
  return true
}

const isFutureDate = (value) => {
  if (value && new Date(value) <= new Date()) {
    throw new Error("Due date must be in the future")
  }
  return true
}

// Validation rules for authentication
const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("username").trim().notEmpty().withMessage("Username is required").toLowerCase().custom(isValidUsername),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),

  body("password").notEmpty().withMessage("Password is required").custom(isStrongPassword),

  handleValidationErrors,
]

const loginValidation = [
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Identifier must be between 3 and 100 characters"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
]

// Validation rules for tasks
const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Task title must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Task description cannot exceed 500 characters"),

  body("priority").optional().custom(isValidPriority),

  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date").custom(isFutureDate),

  handleValidationErrors,
]

const updateTaskValidation = [
  param("id").custom(isValidObjectId),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("Task title must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Task description cannot exceed 500 characters"),

  body("completed").optional().isBoolean().withMessage("Completed must be a boolean value"),

  body("priority").optional().custom(isValidPriority),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .custom((value, { req }) => {
      // Allow clearing due date by setting it to null
      if (value === null) return true
      return isFutureDate(value)
    }),

  handleValidationErrors,
]

const taskIdValidation = [param("id").custom(isValidObjectId), handleValidationErrors]

// Validation rules for user profile
const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("username").optional().trim().toLowerCase().custom(isValidUsername),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),

  handleValidationErrors,
]

// Query validation for tasks
const taskQueryValidation = [
  query("completed").optional().isBoolean().withMessage("Completed filter must be a boolean"),

  query("priority").optional().custom(isValidPriority),

  query("sortBy")
    .optional()
    .isIn(["title", "createdAt", "updatedAt", "dueDate", "priority"])
    .withMessage("Invalid sort field"),

  query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),

  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
]

module.exports = {
  signupValidation,
  loginValidation,
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  updateProfileValidation,
  taskQueryValidation,
  handleValidationErrors,
}
