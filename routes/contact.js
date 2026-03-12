const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET all contact submissions
router.get('/', contactController.getAllSubmissions);

// GET contact submission by ID
router.get('/:id', contactController.getSubmissionById);

// POST new contact submission
router.post('/', contactController.createSubmission);

// PUT update submission status
router.put('/:id/status', contactController.updateSubmissionStatus);

// DELETE contact submission
router.delete('/:id', contactController.deleteSubmission);

module.exports = router;
