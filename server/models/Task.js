const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [1, "Task title cannot be empty"],
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Task description cannot exceed 500 characters"],
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (value) => {
          // If dueDate is provided, it should be in the future
          return !value || value > new Date()
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
)

// Indexes for better query performance
taskSchema.index({ user: 1 })
taskSchema.index({ user: 1, completed: 1 })
taskSchema.index({ user: 1, createdAt: -1 })
taskSchema.index({ dueDate: 1 })

// Virtual for checking if task is overdue
taskSchema.virtual("isOverdue").get(function () {
  return this.dueDate && this.dueDate < new Date() && !this.completed
})

// Static method to get user's task statistics
taskSchema.statics.getUserStats = async function (userId) {
  try {
    const stats = await this.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] },
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$dueDate", new Date()] },
                    { $eq: ["$completed", false] },
                    { $ne: ["$dueDate", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ])

    return stats.length > 0
      ? stats[0]
      : {
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          overdueTasks: 0,
        }
  } catch (error) {
    throw error
  }
}

// Instance method to toggle completion status
taskSchema.methods.toggleCompletion = function () {
  this.completed = !this.completed
  return this.save()
}

// Pre-save middleware to update completion timestamp
taskSchema.pre("save", function (next) {
  if (this.isModified("completed") && this.completed) {
    this.completedAt = new Date()
  } else if (this.isModified("completed") && !this.completed) {
    this.completedAt = undefined
  }
  next()
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
