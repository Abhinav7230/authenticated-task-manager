# MERN Task Manager (Full Stack)

A full-stack task manager application built using the MERN stack (MongoDB, Express, React, Node.js). This project features secure JWT authentication, protected routes, and full CRUD functionality for managing personal tasks.

---

## Tech Stack

- **Frontend**: React, Context API, Axios  
- **Backend**: Node.js, Express, MongoDB, Mongoose  
- **Authentication**: JWT, bcrypt  
- **Database**: MongoDB Atlas  

---

## Features

- 🔐 User registration and login with JWT  
- 🧾 Create, read, update, delete tasks  
- ✅ Toggle task completion  
- 🔒 Protected routes with token auth  
- ⚠️ Form validation and error handling  
- 🌐 RESTful API with secure endpoints  

---

## Project Structure

```
mern-task-manager/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
├── server/             # Node.js + Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── .gitignore
└── README.md
```

---

## Getting Started (Local Setup)

### Clone the repository

```bash
git clone https://github.com/your-username/mern-task-manager.git
cd mern-task-manager
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm start
```

Server runs at: `http://localhost:5000`

### Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

Ensure this is set in `client/package.json` to proxy API requests:

```json
"proxy": "http://localhost:5000"
```

---

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Register a new user  
- `POST /api/auth/login` - Login existing user  
- `GET /api/auth/profile` - Get user profile (requires JWT)

### Task Routes (Protected)

- `GET /api/tasks` - Get all tasks  
- `POST /api/tasks` - Create a task  
- `PUT /api/tasks/:id` - Update a task  
- `DELETE /api/tasks/:id` - Delete a task  
- `PATCH /api/tasks/:id/toggle` - Toggle task completion  

All task routes require a valid JWT token in the `Authorization` header.

---

## Environment Variables

Create a `.env` file in the `server/` directory with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## Future Improvements

- 🔐 Google OAuth login  
- 📆 Task due dates and reminders  
- 📱 Responsive mobile UI  
- 🔍 Task filters and sorting  
- 🌙 Dark/light theme toggle  

---

## License

MIT License

---

## Author

Built with ❤️ by Abhinav Singh Thakur(https://github.com/Abhinav7230)
