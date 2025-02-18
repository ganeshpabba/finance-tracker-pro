// backend/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/roleMiddleware');

router.post('/', protect, hasPermission('createBudget'), createBudget); // Protect and check permissions
router.get('/', protect, hasPermission('readOwnBudgets'), getBudgets); // Protect and check permissions
router.get('/:id', protect, hasPermission('readOwnBudgets'), getBudgetById); // Protect and check permissions
router.put('/:id', protect, hasPermission('updateOwnBudget'), updateBudget); // Protect and check permissions
router.delete('/:id', protect, hasPermission('deleteOwnBudget'), deleteBudget); // Protect and check permissions

module.exports = router;