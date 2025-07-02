"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { taskAPI } from "../services/api" // Updated import
import { ArrowLeft, Edit, Trash2, Check, X } from 'lucide-react'
import Button from "../components/Button"
import TaskModal from "../components/TaskModal"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"

export default function TaskDetails() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [taskId])

  // ✅ Updated to use backend API
  const fetchTask = async () => {
    try {
      setLoading(true)
      const response = await taskAPI.getTask(taskId)
      
      if (response.data.success) {
        setTask(response.data.data.task)
      } else {
        setError("Task not found")
      }
    } catch (err) {
      console.error('Failed to fetch task:', err)
      if (err.response?.status === 404) {
        setError("Task not found")
      } else {
        setError("Failed to fetch task details")
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Updated to use backend API
  const handleUpdateTask = async (taskData) => {
    try {
      const response = await taskAPI.updateTask(taskId, taskData)
      
      if (response.data.success) {
        setTask(response.data.data.task)
        setIsEditModalOpen(false)
        setError("") // Clear any previous errors
      }
    } catch (err) {
      console.error('Failed to update task:', err)
      setError("Failed to update task")
    }
  }

  // ✅ Updated to use backend API
  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await taskAPI.deleteTask(taskId)
        
        if (response.data.success) {
          navigate("/dashboard")
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
        setError("Failed to delete task")
      }
    }
  }

  // ✅ Updated to use backend toggle API
  const handleToggleComplete = async () => {
    try {
      const response = await taskAPI.toggleTask(taskId)
      
      if (response.data.success) {
        setTask(response.data.data.task)
        setError("") // Clear any previous errors
      }
    } catch (err) {
      console.error('Failed to toggle task:', err)
      setError("Failed to update task")
    }
  }

  // ✅ Enhanced loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The task you're looking for doesn't exist."}</p>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <button
                  onClick={handleToggleComplete}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-green-500"
                  }`}
                  aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <CardTitle className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.title}
                </CardTitle>
              </div>
              
              <div className="flex items-center space-x-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    task.completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
                
                {/* ✅ Priority badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority} priority
                </span>
                
                <span className="text-sm text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
                
                {/* ✅ Due date if exists */}
                {task.dueDate && (
                  <span className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button size="sm" variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDeleteTask}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {task.description ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
              <p className={`text-gray-700 whitespace-pre-wrap ${task.completed ? "line-through" : ""}`}>
                {task.description}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}

          {/* ✅ Enhanced error display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateTask}
        task={task}
      />
    </div>
  )
}