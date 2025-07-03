const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// User registration route with validation
router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
],
    userController.registerUser
)

// User login route with validation
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
],
    userController.loginUser
)

// Get authenticated user's profile (protected route)
router.get('/profile',authMiddleware.authUser, userController.getUserProfile)

// User logout route (protected route)
router.get('/logout', authMiddleware.authUser, userController.logoutUser)

module.exports = router