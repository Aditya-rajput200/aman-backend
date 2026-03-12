const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST login
router.post('/login', authController.login);

// GET verify token
router.get('/verify', authController.verifyToken);
router.get('/me', authController.verifyToken);

module.exports = router;
