const express = require("express")
const router = express.Router()
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
} = require("../controllers/taskController")
const { authenticateToken } = require("../middleware/auth")
const {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  taskQueryValidation,
} = require("../middleware/validation")

router.use(authenticateToken)

router.get("/stats", getTaskStats)

router.get("/", taskQueryValidation, getAllTasks)

router.get("/:id", taskIdValidation, getTaskById)

router.post("/", createTaskValidation, createTask)

router.put("/:id", updateTaskValidation, updateTask)

router.delete("/:id", taskIdValidation, deleteTask)

router.patch("/:id/toggle", taskIdValidation, toggleTaskCompletion)

module.exports = router
