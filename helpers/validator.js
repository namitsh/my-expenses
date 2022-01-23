const { body, param, query } = require('express-validator');

// TODO checking of Number is not working, I am not sure, why :(
    // I'll switch to Joi :/
exports.account = [
    body('name').isString().optional().isLength({min:1, max:50}),
    body('balance').isDecimal().withMessage("Invalid Balance").optional()
    .custom(function(v){
        if(v<0) return false;
        return true;
    }),
    body('type').exists().isIn(["cash", "wallet", "account", "other"]),
    body('description').isString().isLength({min:1, max:100}).optional()
]

exports.isId = [
    param('id', "Invalid Id").isMongoId()
]

exports.createTransaction = [
    body('account')
            .exists().withMessage('Account Id is required')
            .isMongoId().withMessage('Invalid Account Id'),
                
        body('amount')
            .exists().withMessage('Amount is required')
            .isDecimal().withMessage('Invalid Amount')
            .custom(function(v){
                if(v<0) return false;
                return true;
            }),
                
        body('comment')
            .isString().withMessage('Comment should be string')
            .isLength({min:1, max:100}).optional(),
                
        body('currency')
            .isString().isLength({max:3}).withMessage('Invalid Currency Type format').optional(),
        
        body('category')
            .isString().withMessage('Category should be string').optional(),
                
        body('transaction_date')
            .isDate().withMessage('Transaction Date should be in date format').optional(),
                
       body('transaction_type').exists().withMessage('Transaction Type is required')
            .isIn(['expense', 'income']).withMessage('Transaction Type is not valid')
]

exports.updateTransaction = [
        body('amount').optional()
            .isDecimal().withMessage('Amount is invalid')
            .custom(function(v){
                if(v<0) return false;
                return true;}),
        body('comment').optional()
            .isString().withMessage('Comment should be string')
            .isLength({min:1,max:100}),
        body('currency').optional()
            .isString().isLength({max:3}).withMessage('Invalid Currency Type format'),
        body('category').optional()
            .isString().withMessage('Category should be string'),
        body('transaction_date').optional()
            .isDate().withMessage('Transaction Date should be in date format YYYY-MM-DD')
]

exports.getTransactions = [
    query('category').optional().notEmpty().isString().withMessage('category should be string'),
    
    query('account').optional().notEmpty().withMessage('Account ID should not be empty').
    isMongoId().withMessage('Invalid Account ID'),

    query('startDate', 'Invalid startDate format. Try Again with YYYY-MM-DD format').optional()
        .notEmpty()
        .isISO8601({strct:true}),

    query('endDate', 'Invalid endDate format. Try Again with YYYY-MM-DD format').optional()
        .notEmpty()
        .isISO8601({strct:true})
        .custom((value, {req}) =>{
            if(value < req.query.startDate){
                throw new Error("endDate should have date after startDate");
            }
            return value;
        })
]

exports.createUser = [
    body('firstName')
        .exists().withMessage('First Name is required')
        .isString().withMessage('First Name should be string').trim()
        .isLength({min:1, max:30}).withMessage('Maximum Length of first name should not exceed 30'),
    
    body('lastName')
        .optional()
        .isString().withMessage('First Name should be string').trim()
        .isLength({min:1, max:30}).withMessage('Maximum Length of first name should not exceed 30'),

    body('email')
        .exists().withMessage('Email Address is required').trim()
        .isEmail().withMessage('Email Address is not valid'),
    
    body('password')
        .exists().withMessage('Password is required')
        .isString().withMessage('Password should be string').trim()
        .isLength({min:7}).withMessage('Minimum Length of password should be more than equal 7')
] 

exports.loginUser = [
    body('email')
        .exists().withMessage('Email Address is required')
        .isEmail().withMessage('Email Address is not valid'),
    
    body('password').isString().withMessage('Password should be string').trim()
        .exists().withMessage('Password is required')
]

exports.updatePassword = [
    body('oldPassword')
            .exists().withMessage('Current Password is required'),
        
    body('newPassword')
        .exists().withMessage('New Password is required')
        .isLength({min:7}).withMessage('Minimum Length of password should be more than 7')
        .custom((value,{ req })=>{
            if (value === req.body.oldPassword) {
                // throw error if passwords do not match
                throw new Error("Current Password should not match with New Password");
            } else {
                return value;
            }
        })
]

