const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET all services
router.get('/', serviceController.getAllServices);

// GET service by ID
router.get('/:id', serviceController.getServiceById);

// POST new service
router.post('/', serviceController.createService);

// PUT update service
router.put('/:id', serviceController.updateService);

// DELETE service
router.delete('/:id', serviceController.deleteService);

module.exports = router;
