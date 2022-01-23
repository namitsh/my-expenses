const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const transactionSchema = new Schema({
    account : {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    amount: {
        type: Number,
        set: v => v.toFixed(2),
        required: true,
        validate: {
            validator: function(v){
                return v >= 0;
            },
            message: "Invalid Amount"
        }
    },
    comment: {
        type: String,
        max: 50,
    },
    currency: {
        type: String,
        default: "INR"
    },
    category: {
        type: String,
        default: "Other"
    },
    transaction_date: {
        type: Date,
        default: Date.now()
    },
    transaction_type: {
        type: String, 
        required: true,
        enum: ["expense", "income"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;