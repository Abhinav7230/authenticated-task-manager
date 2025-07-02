const { Task } = require("../models")
const mongoose = require("mongoose")

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { completed, priority, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query

    // Build filter object - only show user's own tasks
    const filter = { user: userId }

    if (completed !== undefined) {
      filter.completed = completed === "true"
    }

    if (priority) {
      filter.priority = priority
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = order === "asc" ? 1 : -1

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate("user", "name username email")

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(filter)

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: {
        tasks,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(totalTasks / Number.parseInt(limit)),
          totalTasks,
          hasNextPage: skip + tasks.length < totalTasks,
          hasPrevPage: Number.parseInt(page) > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Find task and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, user: userId }).populate("user", "name username email")

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        errors: [
          {
            field: "task",
            message: "Task does not exist or you don't have permission to access it",
          },
        ],
      })
    }

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: { task },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body
    const userId = req.user.userId

    // Create new task (validation already handled by middleware)
    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority || "medium",
      dueDate: dueDate || null,
      user: userId,
    })

    await task.save()

    // Populate user data
    await task.populate("user", "name username email")

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, description, completed, priority, dueDate } = req.body
    const userId = req.user.userId

    // Find task and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, user: userId })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        errors: [
          {
            field: "task",
            message: "Task does not exist or you don't have permission to modify it",
          },
        ],
      })
    }

    // Update fields only if provided
    if (title !== undefined) task.title = title.trim()
    if (description !== undefined) task.description = description ? description.trim() : ""
    if (completed !== undefined) task.completed = completed
    if (priority !== undefined) task.priority = priority
    if (dueDate !== undefined) task.dueDate = dueDate

    await task.save()

    // Populate user data
    await task.populate("user", "name username email")

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: { task },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Find and delete task, ensuring it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: id, user: userId })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        errors: [
          {
            field: "task",
            message: "Task does not exist or you don't have permission to delete it",
          },
        ],
      })
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { task },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskCompletion = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Find task and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, user: userId })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        errors: [
          {
            field: "task",
            message: "Task does not exist or you don't have permission to modify it",
          },
        ],
      })
    }

    // Toggle completion status
    await task.toggleCompletion()

    // Populate user data
    await task.populate("user", "name username email")

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? "completed" : "pending"}`,
      data: { task },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.userId

    const stats = await Task.getUserStats(userId)

    // Get recent tasks (only user's own tasks)
    const recentTasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title completed createdAt")

    res.status(200).json({
      success: true,
      message: "Task statistics retrieved successfully",
      data: {
        stats,
        recentTasks,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
}
