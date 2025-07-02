const { User, Task } = require("../models")

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    })
  } catch (error) {
    console.error("Get user profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, username, email } = req.body
    const userId = req.user.userId

    // Find user
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if username or email already exists (excluding current user)
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: userId } })
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        })
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } })
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        })
      }
    }

    // Update fields
    if (name) user.name = name
    if (username) user.username = username
    if (email) user.email = email

    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          updatedAt: user.updatedAt,
        },
      },
    })
  } catch (error) {
    console.error("Update user profile error:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// @desc    Get dashboard data
// @route   GET /api/user/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId

    // Get task statistics
    const stats = await Task.getUserStats(userId)

    // Get recent tasks
    const recentTasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title completed priority dueDate createdAt")

    // Get overdue tasks
    const overdueTasks = await Task.find({
      user: userId,
      completed: false,
      dueDate: { $lt: new Date(), $ne: null },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .select("title dueDate priority")

    // Get upcoming tasks (due in next 7 days)
    const upcomingTasks = await Task.find({
      user: userId,
      completed: false,
      dueDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .select("title dueDate priority")

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        stats,
        recentTasks,
        overdueTasks,
        upcomingTasks,
      },
    })
  } catch (error) {
    console.error("Get dashboard data error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.userId

    // Delete all user's tasks first
    await Task.deleteMany({ user: userId })

    // Delete user account
    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    console.error("Delete user account error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  getDashboardData,
  deleteUserAccount,
}
