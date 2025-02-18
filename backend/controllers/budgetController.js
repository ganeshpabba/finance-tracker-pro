// backend/controllers/budgetController.js
const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const io = require('../server'); // Import for Socket.IO

const createBudget = asyncHandler(async (req, res) => {
    const { category, amount, startDate, endDate } = req.body;
    if (!category || !amount || !startDate || !endDate) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

     // Basic date validation (you might want more robust validation)
    if (new Date(startDate) >= new Date(endDate)) {
        res.status(400);
        throw new Error('Start date must be before end date');
    }


    const budget = await Budget.create({
        user: req.user._id,
        category,
        amount,
        startDate,
        endDate
    });

    res.status(201).json(budget);
    io.to(req.user._id.toString()).emit('budgetCreated', budget); // Socket event
});

const getBudgets = asyncHandler(async (req, res) => {
    const budgets = await Budget.find({ user: req.user._id }).sort('-createdAt'); // Most recent first
    res.status(200).json(budgets);
});

const getBudgetById = asyncHandler(async (req,res) => {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }

    if (budget.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this budget');
    }
    res.status(200).json(budget)
})

const updateBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }
    if (budget.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this budget');
    }

    const { category, amount, startDate, endDate } = req.body;
    if (new Date(startDate) >= new Date(endDate)) {
        res.status(400);
        throw new Error('Start date must be before end date');
    }
    budget.category = category;
    budget.amount = amount;
    budget.startDate = startDate;
    budget.endDate = endDate;

    const updatedBudget = await budget.save();
    res.status(200).json(updatedBudget);
    io.to(req.user._id.toString()).emit('budgetUpdated', updatedBudget); // Socket event
});

const deleteBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }
    if (budget.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this budget');
    }
    await budget.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Budget deleted' });
    io.to(req.user._id.toString()).emit('budgetDeleted', req.params.id); // Socket event
});

module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
};