const mongoose = require('mongoose');

function MongoClient() {
    this.options = {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    };
    this.connectionUri = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/my-expenses';
}

MongoClient.prototype.initialize = function(){
    mongoose
        .connect(this.connectionUri, this.options)
        .then(()=>{
            console.log("DATABASE CONNECTED SUCCESSFULLY...");
        })
        .catch(err=>{
            console.error(err);
            process.exit(1);
        })
}

module.exports = new MongoClient();