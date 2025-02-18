// backend/controllers/transactionController.js
const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const Budget = require('../models/Budget');
const io = require('../server');  // CORRECT IMPORT of io

const createTransaction = asyncHandler(async (req, res) => {
    const { amount, description, transactionType, category, date } = req.body;

    if (!amount || !description || !transactionType || !category || !date) {
        res.status(400);
        throw new Error('Please provide all required fields: amount, description, transactionType, category, and date.');
    }

    if (transactionType !== 'income' && transactionType !== 'expense') {
        res.status(400);
        throw new Error("transactionType must be 'income' or 'expense'");
    }

      const wallet = await Wallet.findOne({ user: req.user._id });

      if (!wallet) {
        res.status(404);
        throw new Error('Wallet not found for this user.');
      }

    const transaction = await Transaction.create({
        user: req.user._id, // Associate transaction with user
        amount,
        description,
        transactionType,
        category,
        wallet: wallet._id, // Associate transaction with wallet
        date,
    });

    // Update wallet balance
    if(transactionType === 'income'){
        wallet.balance += Number(amount);
    } else {
        wallet.balance -= Number(amount);
    }
    await wallet.save();
  // --- Budget Update Logic ---
    const transactionDate = new Date(date);
    const budgets = await Budget.find({
      user: req.user._id,
      category: category,
      startDate: { $lte: transactionDate }, // Check if transaction date is within budget period
      endDate: { $gte: transactionDate }
    });

    for (const budget of budgets) {
        // We don't actually *store* spent amount in the budget.
        // We calculate it on the fly when needed.  This avoids data redundancy.
        await budget.save(); // Save to trigger update if needed for future features
    }
    // --- End Budget Update Logic ---
    res.status(201).json(transaction);
    // Emit a 'transactionCreated' event to the user's room
    io.to(req.user._id.toString()).emit('transactionCreated', transaction);
    io.to(req.user._id.toString()).emit('walletUpdated', wallet); // Add this line

});

const getTransactions = asyncHandler(async (req, res) => {
    // Find transactions associated with the logged-in user
    const transactions = await Transaction.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json(transactions);
});

const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check if the transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user._id.toString()) {
        res.status(403); // 403 Forbidden
        throw new Error('Not authorized to access this transaction');
    }

    res.status(200).json(transaction);
});

const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check if the transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user._id.toString()) {
        res.status(403); // 403 Forbidden
        throw new Error('Not authorized to update this transaction');
    }
     const { amount, description, transactionType, category, date } = req.body;
        if (transactionType !== 'income' && transactionType !== 'expense') {
            res.status(400);
            throw new Error("transactionType must be 'income' or 'expense'");
        }
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      res.status(404);
      throw new Error('Wallet not found for this user.');
    }

    const amountDifference = amount - transaction.amount;

     if (transactionType === 'income') {
        wallet.balance += amountDifference;
    } else {
        wallet.balance -= amountDifference;
    }
    await wallet.save();

    const transactionDate = new Date(date);
    const budgets = await Budget.find({ // Find relevant budgets
        user: req.user._id,
        category: category,
        startDate: { $lte: transactionDate },
        endDate: { $gte: transactionDate }
    });

    for (const budget of budgets) {
        // Recalculate spent amount and available amount.
        //Consider adding spent amount to track it with budget
      await budget.save();
    }

    transaction.amount = Number(amount);
    transaction.description = description;
    transaction.transactionType = transactionType;
    transaction.category = category;
    transaction.date = date

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
    io.to(req.user._id.toString()).emit('transactionUpdated', updatedTransaction); //socket event.
    io.to(req.user._id.toString()).emit('walletUpdated', wallet);  // Emit updated wallet
});

const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this transaction');
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet) {
        res.status(404);
        throw new Error('Wallet not found for this user.');
      }
    // Update wallet balance *before* deleting the transaction
    if (transaction.transactionType === 'income') {
        wallet.balance -= transaction.amount;
    } else { // expense
        wallet.balance += transaction.amount;
    }
    await wallet.save();


    const transactionDate = new Date(transaction.date);
    const budgets = await Budget.find({ //Find relevant budgets
        user: req.user._id,
        category: transaction.category,
        startDate: { $lte: transactionDate },
        endDate: { $gte: transactionDate }
    });

    for (const budget of budgets) {
      // Recalculate spent amount and available amount
      await budget.save();
    }


    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Transaction deleted' });
    io.to(req.user._id.toString()).emit('transactionDeleted', req.params.id);
     io.to(req.user._id.toString()).emit('walletUpdated', wallet);
});

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};