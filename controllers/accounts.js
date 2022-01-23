const {accounts, transactions, users} = require('../services');
const createHttpError = require('http-errors');

exports.createAccount = async (req, res, next)=>{
    // convert the
    
    const {name, balance, type, description} = req.body;
    // I am assuming here that user is saved in req.user;
    const userId = req.user._id; 
    try{
        // validate user.
        const user = await users.get(userId)
        console.log(user._id);
        const account = await accounts.create(name, balance, type, description, user._id);
        return res.status(201).json(account);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.getAccount = async (req, res, next)=>{
    const id = req.params.id;
    // I am assuming here that user is saved in req.user;
    const userId = req.user._id; 
    try{
        const user = await users.get(userId)
        const account = await accounts.get(id, user._id);
        res.status(200).json(account);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.listAccounts = async (req,res, next)=>{
    // I am assuming here that user is saved in req.user;
    const userId = req.user._id; 
    try{
        const user = await users.get(userId)
        const acc = await accounts.getAll(user._id);
        res.status(200).json(acc);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.updateAccount = async (req,res, next)=>{
    // do something.
    const id = req.params.id;
    const data = req.body;
    // I am assuming here that user is saved in req.user;
    const userId = req.user._id; 
    
    try{
        const user = await users.get(userId)
        const updatedAccount = await accounts.update(id, data, user._id);
        res.status(200).json(updatedAccount);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.deleteAccount = async (req,res, next)=>{
    // do something
    const id = req.params.id;
    // I am assuming here that user is saved in req.user;
    const userId = req.user._id; 
    let deleteTranactions = req.query.delete_tranactions || false;
    
    try{
        const user = await users.get(userId)
        if(deleteTranactions){
            const deleted = await transactions.deleteAll(userId, id);
        }
        const deletedAccount = await accounts.delete(id, user._id);
        res.status(202).json(deletedAccount);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}