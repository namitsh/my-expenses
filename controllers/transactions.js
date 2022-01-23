const transactions = require('../services').transactions;
const users = require('../services').users;
const createHttpError = require('http-errors');

exports.createTransaction = async (req,res,next)=>{
    // do something
    const data = req.body;
    // I am assuming here that user is saved in req.user;
    const userId = req.user._id; 
    try{
        const user = await users.get(userId);
        data.user = user._id;
        const transaction = await transactions.create(data);
        return res.status(201).json(transaction);
    } catch(err) {
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.getTransaction = async (req, res, next)=>{
    // do something
    const id = req.params.id;
    // I am assuming here that user is saved in req.user;
    const userId = req.user._id; 
    try{
        const user = await users.get(userId);
        const transaction = await transactions.get(id, user._id);
        res.status(200).json(transaction);
    } catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.listTransactions = async (req,res, next)=>{
    const userId = req.user._id;
    try{
        const user = await users.get(userId);
        const transList = await transactions.getAll(user._id);
        res.status(200).json(transList);
    } catch(err) {
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.updateTransaction = async (req,res, next)=>{
    const id = req.params.id;
    const data = req.body;
    const userId = req.user._id;
    try{
        const user = await users.get(userId);
        const transaction = await transactions.update(id, data, user._id);
        res.status(200).json(transaction);
    } catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.deleteTransaction = async (req,res, next)=>{
    const id = req.params.id;
    const userId = req.user._id;
    try{
        const user = await users.get(userId);
        const deletedTransaction = await transactions.delete(id, userId);
        res.status(202).json(deletedTransaction);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}