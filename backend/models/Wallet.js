// backend/models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;