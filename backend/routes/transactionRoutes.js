// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/roleMiddleware');

router.post('/', protect, hasPermission('createTransaction'), createTransaction);
router.get('/', protect, hasPermission('readOwnTransactions'), getTransactions);
router.get('/:id', protect, hasPermission('readOwnTransactions'), getTransactionById);
router.put('/:id', protect, hasPermission('updateOwnTransaction'), updateTransaction);
router.delete('/:id', protect, hasPermission('deleteOwnTransaction'), deleteTransaction);

module.exports = router;