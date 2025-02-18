// backend/controllers/reportController.js
const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

const generateReport = asyncHandler(async (req, res) => {
    const { startDate, endDate, category } = req.query;

    // Build the query based on provided parameters
    const query = {
        user: req.user._id,
    };

    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) {
        query.category = category;
    }

    // Aggregate transactions based on the query
    const transactions = await Transaction.find(query).sort('date');

    // Perform aggregations (example: total income/expense)
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        if(transaction.transactionType === "income"){
            totalIncome += transaction.amount
        } else{
            totalExpense += transaction.amount
        }
    })

    res.status(200).json({
        transactions,
        totalIncome,
        totalExpense,
        // Add other aggregated data as needed
    });
});

module.exports = { generateReport };