const Transaction = require('../models').transaction;
const Account = require('../models').account;

exports.create = async (data, userId)=>{
    // data is object;

    if(!data.account || !data.transaction_type || !data.amount || !data.user){ 
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

exports.get = async (id, userId)=>{
    if(!id) return Promise.reject('Invalid Arguments')
    try{
        const transaction = await Transaction.findOne({_id: id, user:userId});
        if(!transaction) return Promise.reject(`Transaction with id ${id} not found`);
        return Promise.resolve(transaction);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.getAll = async (userId, query)=>{
    // get all transactions of loggedIn user
    if(!userId) return Promise.reject('Invalid Argument');
    try{
        const transactions = await Transaction.find({user: userId, ...query});
        return Promise.resolve(transactions);
    } catch(err) {
        return Promise.reject(err);
    }
}

exports.update = async (id, data, userId)=>{
    // do something
    if(data.transaction_type || data.account){
        return Promise.reject('Invalid Argument');
    }
    let session = await Transaction.startSession();
    try{

        session.startTransaction();
        
        const transaction = await Transaction.findOne({_id: id, user: userId}).session(session);
        if(!transaction){
            throw new Error(`Transaction with id ${id} not found`)
        }
        const acc = await Account.findOne({_id: transaction.account, user:userId}).session(session);      
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
        await transaction.save();
        await session.commitTransaction()
        return Promise.resolve(transaction);
        
    } catch(err){
        await session.abortTransaction();
        return Promise.reject(err);
    } finally {
        session.endSession();
    }
}

exports.delete = async (id, userId)=>{
    if(!id) return Promise.reject('Invalid Arguments')
    try{
        const deletedTransaction = await Transaction.findOneAndDelete({_id: id, user:userId});
        if(!deletedTransaction){
            return Promise.reject(`Account with id ${id} not found`);
        }
        return Promise.resolve(deletedTransaction);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.deleteAll = async (userId, accountId) =>{
    if(!userId) return Promise.reject('Invalid Arguments');
    try{
        const result = await Transaction.deleteMany({user: userId, account: accountId});
        console.log('In transactions')
        console.log(result);
        return Promise.resolve('Success');  
    } catch(err) {
        return Promise.reject(err);
    }
}