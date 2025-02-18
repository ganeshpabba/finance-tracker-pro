// backend/routes/walletRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/roleMiddleware');
const Wallet = require('../models/Wallet');
const asyncHandler = require('express-async-handler');


router.get('/balance', protect, hasPermission('readBalance'), asyncHandler(async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ user: req.user._id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        //calculate the income and expense
        const transactions = await Transaction.find({ user: req.user._id, wallet: wallet._id });
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            if(transaction.transactionType === "income"){
                totalIncome += transaction.amount
            } else{
                totalExpense += transaction.amount
            }
        })
        res.json({
            balance: wallet.balance,
            totalIncome,
            totalExpense
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

module.exports = router;