"use strict";

const express = require('express');
const morgan = require('morgan');
const { errorHandler, auth } = require('./middlewares');
const app = express();

// basic express config.
app.use(morgan('dev'))
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// routers;
app.use('/accounts', auth.isAuthorized, require('./routes').accounts)
app.use('/transactions', auth.isAuthorized, require('./routes').transactions)
app.use('/users', require('./routes').users);

// Handle 404
app.use(function(req, res, next) {
    res.status(404);
    res.json({
        status: 404,
        name: "Not Found",
        message: "Page not found"})
    // TODO: WORK ON ERROR HANDLING 
    next();
});
  
// Handle 500
app.use(errorHandler);

module.exports = app;