const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// GET about info
router.get('/', aboutController.getAbout);

// PUT update about info
router.put('/', aboutController.updateAbout);

module.exports = router;
