const createHttpError = require('http-errors');

const mongooseServerErr = (err)=>{
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    let message = `Duplicate field value ${value}`;
    return createHttpError(400,message);
}

const castErr = (err)=>{
    const message = `Invalid ${err.path}: ${err.value}`;
    return createHttpError(400, message);
}

const validationError = (err)=>{
    const message = err.message;
    return createHttpError(400, message);
}

const badRequestErr = (err) =>{
    const message = `Invalid ${err.errors[0].param}: ${err.errors[0].value}`
    return createHttpError(400, message);
}

const devErrorHandler = (err, req, res, next)=>{
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        name: err.name,
        message: err.message,
        path: err.path,
        errors: err.errors,
        stack: err.stack
    });
    next();
}



// TODO: handle prod code.
const prodErrorHandler = (err, req, res, next)=>{
    console.error(err);

    if(err.name === 'CastError'){
        err = castErr(err);
    } else if(err.name === 'MongoServerError'){
        err = mongooseServerErr(err);
    } else if(err.name === 'ValidationError'){
        err = validationError(err);
    } else if(err.name === 'BadRequestError' && err.message === 'Bad Request'){
        err = badRequestErr(err);
    }
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        name: err.name,
        message: err.message,
        errors: err.errors,
    });

    next();
}

module.exports = process.env.NODE_ENV === 'production'? prodErrorHandler : devErrorHandler