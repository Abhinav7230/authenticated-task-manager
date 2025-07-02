const express = require("express")
const router = express.Router()

router.get("/routes", (req, res) => {
  const routes = {
    message: "All available API routes for Task Manager",
    routes: {
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
        verify: "GET /api/auth/verify",
      },
      tasks: {
        getAllTasks: "GET /api/tasks",
        getTask: "GET /api/tasks/:id",
        createTask: "POST /api/tasks",
        updateTask: "PUT /api/tasks/:id",
        deleteTask: "DELETE /api/tasks/:id",
        toggleTask: "PATCH /api/tasks/:id/toggle",
      },
      user: {
        getProfile: "GET /api/user/profile",
        updateProfile: "PUT /api/user/profile",
        deleteAccount: "DELETE /api/user/account",
        getDashboard: "GET /api/user/dashboard",
      },
    },
  }
  res.json(routes)
})

module.exports = router
