// src/contexts/TaskContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { taskAPI } from '../services/api'; // Import taskAPI

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      return;
    }
    try {
      const response = await taskAPI.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Fetch tasks error:', error);
    }
  }, [token]);

  // Create a new task
  const createTask = async (taskData) => {
    try {
      const response = await taskAPI.post('/tasks', taskData);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Create task error:', error);
    }
  };

  // Update task
  const updateTask = async (id, updatedData) => {
    try {
      const response = await taskAPI.put(`/tasks/${id}`, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? response.data : task
        )
      );
    } catch (error) {
      console.error('Update task error:', error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await taskAPI.deleteTask(taskId);
      if (response.data.success) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        return { success: true };
      }
    } catch (error) {
      console.error('Delete task error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete task';
      return { success: false, error: errorMessage };
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    try {
      const response = await taskAPI.toggleTask(taskId);
      if (response.data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? response.data.data.task : task
          )
        );
        return { success: true };
      }
    } catch (error) {
      console.error('Toggle task error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle task';
      return { success: false, error: errorMessage };
    }
  };

  // Optional: cleaner update method
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await taskAPI.updateTask(taskId, taskData);
      if (response.data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? response.data.data.task : task
          )
        );
        return { success: true };
      }
    } catch (error) {
      console.error('Update task error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update task';
      return { success: false, error: errorMessage };
    }
  };

  // Load tasks when token changes
  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [token, fetchTasks]);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    handleUpdateTask, // Optional separate updater
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
