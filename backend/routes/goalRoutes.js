// backend/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/roleMiddleware');


router.post('/', protect, hasPermission('createGoal'), createGoal); // Protect and check permissions
router.get('/', protect, hasPermission('readOwnGoals'), getGoals); // Protect and check permissions
router.get('/:id', protect, hasPermission('readOwnGoals'), getGoalById); // Protect and check permissions
router.put('/:id', protect, hasPermission('updateOwnGoal'), updateGoal); // Protect and check permissions
router.delete('/:id', protect, hasPermission('deleteOwnGoal'), deleteGoal); // Protect and check permissions

module.exports = router;