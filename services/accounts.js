const Account = require('../models').account;
const transactions = require('./transactions');

exports.create = async (name, balance, type, description)=>{
    try{
        const account = new Account({
            name, balance, type, description
        });
        await account.save()     
        return Promise.resolve(account);
    }
    catch(err){
        return Promise.reject(err);
    }
}

exports.get = async (id)=>{
    if(!id) return Promise.reject('Invalid Arguments')
    try{
        const account = await Account.findById(id);
        if(!account){
            return Promise.reject(new Error(`Account with id ${id} not found`));
        }
        return Promise.resolve(account);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.getAll = async ()=>{
    try{
        const accounts = await Account.find();
        return Promise.resolve(accounts);
    } catch(err) {
        return Promise.reject(err);
    }
}


exports.update = async (id,name,balance,type, description)=>{
    // TODO : TEST THIS METHOD AFTER TRANSACTION SERVICE COMPLETES
    let result = {};

    if(!id) return Promise.reject('Invalid Arguments');
    if(!name && !balance && !type && !description) return Promise.reject('Invalid Arguments');
    
    const session = await Account.startSession();
    
    try{
        let transaction;
        const account = await this.get(id);
        if(!account){
            return Promise.reject(new Error(`Account with id ${id} not found`));
        }
        if(name){
            result.name = name;
        }
        if(balance){
            result.balance = balance
            // create a transacion according to the prev balance
            // if prev balance
            if(balance>account.balance){
                // create a new transaction with income.
                let transactionBalance = balance - account.balance;
                transaction = await transactions.create(transactionBalance); 
            }
            else if(balance<account.balance){
                // create a new transaction with expense
                let transactionBalance = account.balance - balance;
                transaction = await transactions.create(transactionBalance);
            } 
        }
        if(description){
            result.description = description;
        }
        if(type){
            result.type = type;
        }
        const updatedAccount = await Account.findByIdAndUpdate(id, result,{new:true});
        if(!updatedAccount){
            throw new Error(`Account with id ${id} not found`)
        }
        await session.commitTransaction();
        return updatedAccount;
    }
    catch(err){
        session.abortTransaction();
        throw(err);
    }
    finally{
        session.endSession();
    }
}

exports.delete = async (id)=>{
    if(!id) return Promise.reject('Invalid Arguments')
    try{
        const deletedAccount = await Account.findByIdAndDelete(id);
        if(!deletedAccount){
            return Promise.reject(new Error(`Account with id ${id} not found`));
        }
        return Promise.resolve(deletedAccount);
    } catch(err){
        return Promise.reject(err);
    }
}