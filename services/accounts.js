const Account = require('../models').account;
const Transaction = require('../models').transaction;
exports.create = async (name, balance, type, description, userId)=>{
    if(!balance || !type || !userId) return Promise.reject('Invalid arguments');
    try{
        const account = new Account({
            name, balance, type, description, user:userId
        });
        await account.save();     
        return Promise.resolve(account);
    }
    catch(err){
        return Promise.reject(err);
    }
}

exports.get = async (id, userId)=>{
    if(!id || !userId) return Promise.reject('Invalid Arguments')
    try{
        const account = await Account.findOne({_id: id, user:userId});
        if(!account){
            return Promise.reject(`Account with id ${id} not found`);
        }
        return Promise.resolve(account);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.getAll = async (userId)=>{
    if(!userId) return Promise.reject('Invalid Arguments');
    try{
        const accounts = await Account.find({user: userId});
        return Promise.resolve(accounts);
    } catch(err) {
        return Promise.reject(err);
    }
}


exports.update = async (id, data, userId)=>{
    if(!id || !data || !userId) return Promise.reject('Invalid Arguments');

    // TODO : TEST THIS METHOD AFTER TRANSACTION SERVICE COMPLETES

    let result = {};
    if(!data.name && !data.balance && !data.type && !data.description ){
        return Promise.reject('Invalid Arguments');
    }

    const session = await Account.startSession();
    try{
        let transaction;
        session.startTransaction();
        const account = await Account.findOne({_id:id, user: userId}).session(session);
        if(!account){
            throw new Error(`Account with id ${id} not found`);
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
                    category: 'MODIFIED_ACCOUNT_BALANCE',
                    user: userId
                }
            }
            else if(data.balance<account.balance){
                // create a new transaction with expense
                let transactionBalance = account.balance - data.balance;
                transactionObj = {
                    account: account._id,
                    transaction_type: 'expense',
                    amount: transactionBalance,
                    category: 'MODIFIED_ACCOUNT_BALANCE',
                    user: userId
                }  
            }
            transaction = new Transaction(transactionObj);
            result.balance = data.balance 
        }

        const [ _, updatedAccount] = await Promise.all(
            [
                transaction.save({session: session}),
                Account.findOneAndUpdate({_id: id, user:userId}, result,
                    {new:true, runValidators: true}).session(session)
            ]);
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

exports.delete = async (id, userId)=>{
    if(!id || userId) return Promise.reject('Invalid Arguments')
    try{
        const deletedAccount = await Account.findOneAndDelete({_id: id, user:userId});
        if(!deletedAccount){
            return Promise.reject(`Account with id ${id} not found`);
        }
        return Promise.resolve(deletedAccount);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.deleteAll = async (accountIds, userId)=>{
    if(!accountIds || !userId) return Promise.reject('Invalid Arguments')
    try{
        const deleted = await Account.deleteMany({_id: accountIds, user: userId});
        return Promise.resolve(deleted);
    } catch(err){
        return Promise.reject(err);
    }
}