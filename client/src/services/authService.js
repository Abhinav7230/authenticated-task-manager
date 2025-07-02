import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  async signup(name, username, email, password) {
    const response = await api.post("/auth/signup", { name, username, email, password })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me")
    return response.data
  },
}

export const taskService = {
  async getTasks() {
    const response = await api.get("/tasks")
    return response.data
  },

  async createTask(task) {
    const response = await api.post("/tasks", task)
    return response.data
  },

  async updateTask(id, task) {
    const response = await api.put(`/tasks/${id}`, task)
    return response.data
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },
}
