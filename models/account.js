"use strict";

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const accountSchema = new Schema({
    name: String ,
    balance: {
        type: Number,
        set: v => v.toFixed(2),
        default: 0,
        validate: {
            validator: function(v){
                return v >= 0;
            },
            message: "Invalid Balance"
        }
    },
    type: {
        type: String,
        required: true,
        // TODO: credit card system, I need to understand., then I'll add and probably more options
        // till now , this only 
        enum: ["cash", "wallet", "account", "others"]
    },
    description: {
        type: String, 
        max: 100
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;