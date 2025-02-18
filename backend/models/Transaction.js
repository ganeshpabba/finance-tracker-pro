// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Wallet'
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;