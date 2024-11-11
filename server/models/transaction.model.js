const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        required: true 
    },
    provider: { 
        type: String, 
        default: 'SWIFT' // Default to SWIFT
    }, 
    destinationAccount: { 
        type: String, 
        required: true 
    },
    swiftCode: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'verified'], 
        default: 'pending' // pending, verified
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
