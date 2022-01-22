const transactions = require('../services').transactions;
const accounts = require('../services').accounts;
const createHttpError = require('http-errors');

exports.createTransaction = async (req,res,next)=>{
    // do something
    const data = req.body;
    try{
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
    try{
        const transaction = await transactions.get(id);
        res.status(200).json(transaction);
    } catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.listTransactions = async (req,res, next)=>{
    try{
        const transList = await transactions.getAll();
        res.status(200).json(transList);
    } catch(err) {
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.updateTransaction = async (req,res, next)=>{
    const id = req.params.id;
    const data = req.body;
    try{
        const transaction = await transactions.update(id, data);
        res.status(200).json(transaction);
    } catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }
}

exports.deleteTransaction = async (req,res, next)=>{
    const id = req.params.id;
    try{
        const deletedTransaction = await transactions.delete(id);
        res.status(202).json(deletedTransaction);
    }
    catch(err){
        const httpError = createHttpError(400, err);
        next(httpError);
    }

}