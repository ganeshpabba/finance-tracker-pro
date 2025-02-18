// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');

router.post('/register', rateLimitMiddleware, registerUser); // Apply rate limiting
router.post('/login', rateLimitMiddleware, loginUser); // Apply rate limiting

module.exports = router;