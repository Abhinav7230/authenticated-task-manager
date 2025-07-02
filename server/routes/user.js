const express = require("express")
const router = express.Router()
const {
  getUserProfile,
  updateUserProfile,
  getDashboardData,
  deleteUserAccount,
} = require("../controllers/userController")
const { authenticateToken } = require("../middleware/auth")
const { updateProfileValidation } = require("../middleware/validation")
const { checkProfileUpdateUnique } = require("../middleware/uniqueValidation")

// Apply authentication middleware to all routes
router.use(authenticateToken)

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", getUserProfile)

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", updateProfileValidation, checkProfileUpdateUnique, updateUserProfile)

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete("/account", deleteUserAccount)

// @route   GET /api/user/dashboard
// @desc    Get dashboard data (user stats, recent tasks, etc.)
// @access  Private
router.get("/dashboard", getDashboardData)

module.exports = router
