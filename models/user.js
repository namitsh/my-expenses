"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
var Schema = mongoose.Schema;


const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String
    },
    email: {
        type: String, 
        required: [true, 'User email is required'],
        trim: true,
        unique: true, 
        lowercase: true,
        validate: {
            validator: function(v){
                return validator.isEmail(v)
            },
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength: [7, 'Minimum user password length is 7'],
        trim: true
    }
},{
    timestamps: true
});

userSchema.methods.toJSON = function(){
    const attrs = this.toObject();
    delete attrs.password;
    return attrs;
};

userSchema.pre('save', async function(next){
    const user = this;
    try{
        if(user.isModified('password')){
            const salt = parseInt(process.env.SALT) || 8;
            const hashPassword = await bcrypt.hash(user.password, salt);
            user.password = hashPassword;
        }
        next();
    } catch(err){
        next(err);
    }
});

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY, { expiresIn: '1h' })
        return token;
    } catch(err){
        throw err;
    }
    
}

module.exports = mongoose.model('User', userSchema);