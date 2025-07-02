const express = require("express")
const router = express.Router()
const { signup, login, verifyToken, logout } = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")
const { signupValidation, loginValidation } = require("../middleware/validation")
const { checkEmailUnique, checkUsernameUnique } = require("../middleware/uniqueValidation")

router.post("/signup", signupValidation, checkEmailUnique, checkUsernameUnique, signup)

router.post("/login", loginValidation, login)

router.post("/logout", authenticateToken, logout)

router.get("/verify", authenticateToken, verifyToken)

module.exports = router
