# 🧪 API Testing Guide - Task Manager Backend

## Prerequisites
- Server running on `http://localhost:5000`
- Postman or similar API testing tool
- MongoDB connection established

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

---

## 🔐 Authentication Tests

### 1. Test Server Connectivity
**GET** `http://localhost:5000/`
- Should return: `{"message": "Task Manager API is running!"}`

### 2. User Signup
**POST** `/auth/signup`

**Headers:**
\`\`\`
Content-Type: application/json
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Expected Response (201):**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "timestamp"
    },
    "token": "jwt_token_here"
  }
}
\`\`\`

**⚠️ SAVE THE TOKEN** - You'll need it for all subsequent requests!

### 3. User Login
**POST** `/auth/login`

**Headers:**
\`\`\`
Content-Type: application/json
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "identifier": "john@example.com",
  "password": "password123"
}
\`\`\`

**Expected Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "jwt_token_here"
  }
}
\`\`\`

### 4. Test Unauthorized Access
**GET** `/tasks`

**Headers:** (No Authorization header)

**Expected Response (401):**
\`\`\`json
{
  "success": false,
  "message": "Access token is required"
}
\`\`\`

### 5. Verify Token
**GET** `/auth/verify`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

**Expected Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {...}
  }
}
\`\`\`

---

## 📋 Task Management Tests

**⚠️ For all task routes, include the Authorization header:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

### 6. Create Task
**POST** `/tasks`

**Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "title": "Complete API Testing",
  "description": "Test all backend routes thoroughly",
  "priority": "high",
  "dueDate": "2024-01-15T10:00:00.000Z"
}
\`\`\`

**Expected Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "task_id_here",
      "title": "Complete API Testing",
      "description": "Test all backend routes thoroughly",
      "completed": false,
      "priority": "high",
      "dueDate": "2024-01-15T10:00:00.000Z",
      "user": "user_id_here",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
}
\`\`\`

**⚠️ SAVE THE TASK ID** - You'll need it for update/delete operations!

### 7. Get All Tasks
**GET** `/tasks`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

**Query Parameters (Optional):**
\`\`\`
?completed=false&priority=high&sortBy=createdAt&order=desc&page=1&limit=10
\`\`\`

### 8. Get Task by ID
**GET** `/tasks/TASK_ID_HERE`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

### 9. Update Task
**PUT** `/tasks/TASK_ID_HERE`

**Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true,
  "priority": "medium"
}
\`\`\`

### 10. Toggle Task Completion
**PATCH** `/tasks/TASK_ID_HERE/toggle`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

### 11. Get Task Statistics
**GET** `/tasks/stats`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

---

## 👤 User Management Tests

### 12. Get User Profile
**GET** `/user/profile`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

### 13. Get Dashboard Data
**GET** `/user/dashboard`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

### 14. Update User Profile
**PUT** `/user/profile`

**Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "name": "John Updated",
  "username": "johnupdated",
  "email": "johnupdated@example.com"
}
\`\`\`

---

## 🧹 Cleanup Tests

### 15. Delete Task
**DELETE** `/tasks/TASK_ID_HERE`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

### 16. Logout
**POST** `/auth/logout`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN_HERE
\`\`\`

---

## 🔍 Testing Checklist

- [ ] Server connectivity works
- [ ] User signup creates new user and returns token
- [ ] User login authenticates and returns token
- [ ] Unauthorized requests are blocked (401 status)
- [ ] Token verification works
- [ ] Task creation works and links to user
- [ ] Task retrieval shows only user's tasks
- [ ] Task updates work and validate ownership
- [ ] Task deletion works and validates ownership
- [ ] Task toggle changes completion status
- [ ] User profile retrieval works
- [ ] Dashboard data includes task statistics
- [ ] All protected routes require valid JWT token

## 🚨 Common Issues

1. **401 Unauthorized**: Check if JWT token is included in Authorization header
2. **404 Not Found**: Verify the endpoint URL is correct
3. **500 Internal Server Error**: Check server logs and database connection
4. **400 Bad Request**: Verify request body format and required fields

## 📝 Notes

- JWT tokens expire based on `JWT_EXPIRES_IN` environment variable
- All timestamps are in ISO 8601 format
- Task ownership is automatically handled by the authentication middleware
- Passwords are automatically hashed before storage
\`\`\`

Let's also create a quick test runner script for Node.js:
