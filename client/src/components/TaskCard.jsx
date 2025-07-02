"use client"

import { Edit, Trash2, Check } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "./Button"
import { Card, CardContent } from "./Card"

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <button
                onClick={() => onToggleComplete(task)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? "bg-green-500 border-green-500 text-white shadow-lg"
                    : "border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                }`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              <Link
                to={`/tasks/${task._id}`}
                className={`font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
                  task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
                }`}
              >
                {task.title}
              </Link>
            </div>

            {task.description && (
              <p
                className={`text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 ${
                  task.completed ? "line-through" : ""
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  task.completed
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="sm" variant="ghost" onClick={() => onEdit(task)} aria-label="Edit task">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task._id)}
              aria-label="Delete task"
              className="hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
