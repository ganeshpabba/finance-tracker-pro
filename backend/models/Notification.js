const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: { // Add a type field to specify the kind of notification
      type: String,
      enum:['transaction', 'budget', 'goal', 'system'], // Example types
      required: true
    }
    // You can add more fields here, like:
    // transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    // budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },

}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;