"use client"

import { useAuth } from "../contexts/AuthContext"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { LogOut, CheckSquare, User, Home } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) return null

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 group-hover:from-purple-600 group-hover:to-blue-700 transition-all duration-200">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>

            <div className="hidden md:flex space-x-1">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
              Welcome, <span className="font-medium">{user.name || user.username}</span>
            </span>

            <ThemeToggle />

            <Link
              to="/profile"
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                isActive("/profile")
                  ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              aria-label="Profile"
            >
              <User className="h-4 w-4" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
