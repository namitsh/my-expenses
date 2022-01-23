const User = require('../models').user;
const bcrypt = require('bcryptjs');

exports.create = async (data)=>{
    // check data 
    if(!data.firstName || !data.email || !data.password){
        return Promise.reject('Invalid Argument');
    }
    try{
        const user = new User(data);
        await user.save();
        return Promise.resolve(user);
    } catch(err){
        return Promise.reject(err);
    }
};

exports.get = async (id)=>{
    if(!id) return Promise.reject('Invalid Arguments');
    try{
        const user = await User.findById(id);
        if(!user) return Promise.reject(`User with ${id} not found`);
        return Promise.resolve(user);
    } catch(err) {
        return Promise.reject(err);
    }
}

exports.findByCredentials = async (email, password)=>{
    // do something
    if(!email || !password) return Promise.reject('email or password not specified');
    try{
        // find the user
        const user = await User.findOne({email:email});
        if(!user){
            return Promise.reject('Unauthorized User');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return Promise.reject('Unauthorized User');
        return Promise.resolve(user);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.updatePassword = async (id, oldPassword, newPassword)=>{
    if(!id || !oldPassword || !newPassword) return Promise.reject('Invalid arguments');
    try{
        const user = await User.findById(id);
        if(!user) return Promise.reject(`User with ${id}not found`); 
        const isValid = await bcrypt.compare(oldPassword, user.password);
        if(!isValid) return Promise.reject('Unauthorized User invalid');
        user.password = newPassword;
        await user.save();
        return Promise.resolve('Done');
    } catch(err){
        return Promise.reject(err);
    }
}

exports.delete = async (id)=>{
    // TODO : delete all associated accounts and it's transactions as well.
    if(!id) return Promise.reject('Invalid argument');
    try{
        const user = await User.findByIdAndDelete(id);
        if(!user) Promise.reject(`User with ${id} not found`);
    } catch(err){
        return Promise.reject(err);
    }
}