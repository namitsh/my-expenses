const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');


exports.isAuthorized = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        if(!token) return next(new createHttpError[403]);
        const decodedToken =  jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch(err){
        const httpError = createHttpError(400, 'Invalid Token Provided');
        next(httpError);
    }  
}