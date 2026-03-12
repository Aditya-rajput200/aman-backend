const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST login
router.post('/login', authController.login);

// POST register (for creating admin users)
router.post('/register', authController.register);

// GET verify token
router.get('/verify', authController.verifyToken);
router.get('/me', authController.verifyToken);

module.exports = router;
