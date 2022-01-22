const Transaction = require('../models').transaction;
const Account = require('../models').account;

exports.create = async (data)=>{
    // data is object;

    if(!data.account || !data.transaction_type || !data.amount){ 
        return Promise.reject('Invalid Argument'); 
    }

    let session = await Transaction.startSession();
    try{
        // start session here;

        session.startTransaction();
        
        const account = await Account.findById(data.account).session(session);
        if(!account){
            throw new Error(`Account with id ${data.account} not found`)
        }
        let balance;
        if(data.transaction_type === 'expense'){
            balance = account.balance - data.amount;
        }
        else{
            balance = account.balance + data.amount;
        }

        // update the account { 
        // TODO: probably would change this way afterwards(findByIdAndUpdate mainly) }
        account.balance = balance;
        await account.save();
        
        // create a transaction
        const transaction = new Transaction(data);
        await transaction.save({ session });
        
        // commit the transaction 
        await session.commitTransaction()

        return Promise.resolve(transaction);
    } catch(err) {
        await session.abortTransaction();
        return Promise.reject(err);
    } finally {
        session.endSession();
    }
}

exports.get = async (id)=>{
    if(!id) return Promise.reject('Invalid Arguments')
    try{
        const transaction = await Transaction.findById(id);
        if(!transaction) return Promise.reject(`Transaction with id ${id} not found`);
        return Promise.resolve(transaction);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.getAll = async ()=>{
    try{
        const transactions = await Transaction.find();
        return Promise.resolve(transactions);
    } catch(err) {
        return Promise.reject(err);
    }
}

exports.update = async (id, data)=>{
    // do something
    if(data.transaction_type || data.account){
        return Promise.reject('Invalid Argument');
    }
    let session = await Transaction.startSession();
    try{

        session.startTransaction();
        
        const transaction = await Transaction.findById(id).session(session);
        if(!transaction){
            throw new Error(`Transaction with id ${id} not found`)
        }
        const acc = await Account.findById(transaction.account).session(session);      
        if(!acc){
            throw new Error(`Account with id ${acc._id} not found`)
        }

        if(data.comment) transaction.comment = data.comment;
        if(data.currency) transaction.currency = data.currency; 
        if(data.category) transaction.category = data.category; 
        if(data.transaction_date) transaction.transaction_date = data.transaction_date; 


        if(data.amount){
            let oldBalance, newBalance;
            if(transaction.transaction_type === 'expense'){
                oldBalance = acc.balance + transaction.amount;
                newBalance = oldBalance - data.amount;
                if(newBalance<0){
                    throw new Error('Cannot process this updatation');
                }
            }
            else{
                oldBalance = acc.balance - transaction.amount;
                newBalance = oldBalance + data.amount;
                if(newBalance<0){
                    throw new Error('Cannot process this updatation');
                }
            }
            acc.balance = newBalance;
            transaction.amount = data.amount;
        }        
        // update the account
        await acc.save();
        console.log(acc.balance);
        await transaction.save();
        console.log(transaction)
        await session.commitTransaction()
        return Promise.resolve(transaction);
        
    } catch(err){
        await session.abortTransaction();
        return Promise.reject(err);
    } finally {
        session.endSession();
    }
}

exports.delete = async (id)=>{
    if(!id) return Promise.reject('Invalid Arguments')
    try{
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if(!deletedTransaction){
            return Promise.reject(`Account with id ${id} not found`);
        }
        return Promise.resolve(deletedTransaction);
    } catch(err){
        return Promise.reject(err);
    }
}