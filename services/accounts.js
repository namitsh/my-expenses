const Account = require('../models').account;
const Transaction = require('../models').transaction;

const updateAccountFromTransaction = async (id, balance)=>{
    let patchObject = { balance: balance };
    try{
        const account = await Account.findById(id);
        const updatedAccount = await Account.findByIdAndUpdate(id, patchObject,{new:true});
        if(!updatedAccount){
            Promise.reject(`Account with id ${id} not found`);
        }
        return Promise.resolve(updatedAccount);
    } catch(err) {
        return Promise.reject(err);
    }
}

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
            return Promise.reject(`Account with id ${id} not found`);
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


exports.update = async (id, data)=>{
    if(!id) return Promise.reject('Invalid Arguments');

    // TODO : TEST THIS METHOD AFTER TRANSACTION SERVICE COMPLETES

    let result = {};
    if(!data.name && !data.balance && !data.type && !data.description){
        return Promise.reject('Invalid Arguments');
    }

    const session = await Account.startSession();
    try{
        let transaction;
        session.startTransaction();
        const account = await Account.findById(id).session(session);
        if(!account){
            return Promise.reject(`Account with id ${id} not found`);
        }
        if(data.name) result.name = data.name;
        if(data.description) result.description = data.description;
        if(data.type) result.type = data.type;
        if(data.balance){
            let transactionObj;
            // create a transacion according to the prev balance
            // if prev balance
            if(data.balance>account.balance){
                // create a new transaction with income.
                let transactionBalance = data.balance - account.balance;
                transactionObj = {
                    account: account._id,
                    transaction_type: 'income',
                    amount: transactionBalance,
                    category: 'MODIFIED_ACCOUNT_BALANCE'
                }
            }
            else if(data.balance<account.balance){
                // create a new transaction with expense
                let transactionBalance = account.balance - data.balance;
                transactionObj = {
                    account: account._id,
                    transaction_type: 'expense',
                    amount: transactionBalance,
                    category: 'MODIFIED_ACCOUNT_BALANCE'
                }  
            }
            transaction = new Transaction(transactionObj);
            await transaction.save({session: session});
            result.balance = data.balance 
        }
        
        const updatedAccount = await Account.findByIdAndUpdate(id, result,{new:true, runValidators: true}).
        session(session);
        if(!updatedAccount){
            throw new Error(`Account with id ${id} not found`)
        }
        await session.commitTransaction();
        return Promise.resolve(updatedAccount);
    }
    catch(err){
        await session.abortTransaction();
        return Promise.reject(err);
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