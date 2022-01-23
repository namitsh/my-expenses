const users = require('../services').users
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
        const token = user.generateAuthToken();
        res.status(200).json({...user, token});

    } catch(err){
        next(createHttpError(400,err))
    }
}

exports.getUser = async (req,res,next)=>{
    // do something
    const id = req.params.id;
    try{
        const user = await users.get(id);
        res.status(200).json(user);
    } catch(err){
        next(createHttpError(400,err))
    }
}

exports.updateUserPassword = async (req,res,next)=>{
    // do something
    const id = req.params.id;
    const {oldPassword, newPassword} = req.body;
    try{
        await users.updatePassword(id, oldPassword, newPassword);
        res.status(204).end();
    } catch(err){
        next(createHttpError(400,err))
    }
}

exports.deleteUser = async ()=>{
    // do something
    try{

    } catch(err){
        next(createHttpError(400,err))
    }
}