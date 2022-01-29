const {users,transactions,accounts} = require('../services')
const createHttpError = require('http-errors');

exports.createUser = async (req,res,next)=>{
    // do something
    const data = req.body;
    try{
        const user = await users.create(data);
        res.status(201).json(user);
    } catch(err){
        next(createHttpError(400,err))
    }
}

exports.loginUser = async (req,res,next)=>{
    const {email, password} = req.body;
    try{
        // check whether user is authenticated;
        const user = await users.findByCredentials(email, password);
        if(!user){
            return next(new createHttpError.Unauthorized('Invalid email or password')); 
        }
        const token = await user.generateAuthToken();
        res.status(200).json({user, token});

    } catch(err){
        next(createHttpError(400,err))
    }
}

exports.getUser = async (req,res,next)=>{
    // do something
    const userId = req.user._id;
    try{
        const user = await users.get(userId);
        res.status(200).json(user);
    } catch(err){
        next(createHttpError(400,err))
    }
}

exports.updateUserPassword = async (req,res,next)=>{
    // do something
    const {oldPassword, newPassword} = req.body;
    const userId = req.user._id;
    try{
        // TODO: it seems, we don't need to do do db query after every request to get user. :( 
            // refractor all controllers, means, all controller :huh. 
        const user = await users.get(userId);
        const success = await users.updatePassword(user._id, oldPassword, newPassword);
        res.status(202).json(success);
    } catch(err){
        next(createHttpError(400,err))
    }
}

exports.deleteUser = async (req, res, next)=>{
    // do something
    const userId = req.user._id;
    try{
        // first getAll accounts;
        let acc = [];
        const accountList = await accounts.getAll(userId); 

        for(let accObj of accountList){
            acc.push(accObj._id.toString());
        }
        // delete the transactions;
        const successTrans = await transactions.deleteAll(userId, acc);
        const successAccount = await accounts.deleteAll(acc, userId);
        if(!successAccount || !successTrans){
            return next(createHttpError(500))
        }
        const user = await users.delete(userId);
        res.status(204).json('Success');
    } catch(err){
        next(createHttpError(400,err))
    }
}