// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/auth/verify')
          if (response.data.success) {
            setUser(response.data.data.user)
          } else {
            localStorage.removeItem('token')
            setToken(null)
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }

    verifyToken()
  }, [token])

  // LOGIN FUNCTION
  const login = async (identifier, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        identifier,
        password
      })

      if (response.data.success) {
        const { user, token } = response.data.data
        setUser(user)
        setToken(token)
        localStorage.setItem('token', token)
        
        return { success: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 'Login failed'
      return { success: false, error: errorMessage }
    }
  }

  // SIGNUP FUNCTION
  const signup = async (name, username, email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        name,
        username,
        email,
        password
      })

      if (response.data.success) {
        const { user, token } = response.data.data
        setUser(user)
        setToken(token)
        localStorage.setItem('token', token)
        
        return { success: true }
      }
    } catch (error) {
      console.error('Signup error:', error)
      const errorMessage = error.response?.data?.message || 'Signup failed'
      return { success: false, error: errorMessage }
    }
  }

  // LOGOUT FUNCTION
  const logout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:3000/api/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}