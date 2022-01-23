const createHttpError = require('http-errors');

const {validationResult} = require('express-validator');

module.exports = validations => {
    return async (req, res, next) => {
        try{
            await Promise.all(validations.map(validation => validation.run(req)));
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }
            next(new createHttpError(400, errors))
        } catch(err){
            next(new createHttpError(400, err));
        }
    };
};