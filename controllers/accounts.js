const accounts = require('../services').accounts;
const createHttpError = require('http-errors');

exports.createAccount = async (req, res, next)=>{
    // convert the

    const {name, balance, type, description} = req.body;

    try{
        const account = await accounts.create(name, balance, type, description);
        return res.status(201).json(account);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.getAccount = async (req, res, next)=>{
    const id = req.params.id;
    try{
        const account = await accounts.get(id);
        res.status(200).json(account);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.listAccounts = async (req,res, next)=>{
    try{
        const acc = await accounts.getAll();
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
    try{
        const updatedAccount = await accounts.update(id, data);
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
    try{
        const deletedAccount = await accounts.delete(id);
        res.status(202).json(deletedAccount);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}