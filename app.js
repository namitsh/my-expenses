"use strict";

const express = require('express');
const morgan = require('morgan');
const app = express();

// basic express config.
app.use(morgan('dev'))
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// routers;
app.use('/accounts', require('./routes').accounts)
app.use('/transactions', require('./routes').transactions)

// Handle 404
app.use(function(req, res, next) {
    res.status(404);
    res.json({"message": "Page not found"})
    // TODO: WORK ON ERROR HANDLING 
    next();
});
  
// Handle 500
app.use(function(error, req, res, next) {
    // TODO: create a errorHandler middleware.
    res.send('500: Internal Server Error', 500);
});

module.exports = app;