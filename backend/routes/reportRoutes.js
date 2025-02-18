// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/roleMiddleware');

router.get('/', protect, hasPermission('generateReports'), generateReport); // Added permission check

module.exports = router;