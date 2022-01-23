const devErrorHandler = (err, req, res, next)=>{
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
        status: err.statusCode,
        name: err.name,
        message: err.message,
        path: err.path,
        errors: err.errors && err.errors.isArray()? err.errors[0]:err.errors,
        stack: err.stack
    });
    next();
}

const prodErrorHandler = (err, req, res, next)=>{
    console.error(err);

    if(err.name === 'CastError'){

    } else if(err.name === 'MongoError'){

    } else if(err.name === 'ValidationError'){

    } else if(err.name === 'Bad Request' || err.name === 'BadRequestError'){

    }
    else{
        res.status(500).json({
            status: 500, 
            message: 'Internal Server Error'
        });
    }
    next();
}

module.exports = process.env.NODE_ENV === 'production'? prodErrorHandler : devErrorHandler