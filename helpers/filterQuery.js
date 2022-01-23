const filterQuery = (query)=>{
    // check for account
    let result = {};
    if(query.account){
        result.account = query.account;
    }
    // checkStartDate and checkEndDate
    /* 
    MongoDB stores dates as 64-bit integers, which means that Mongoose does not store timezone 
    information by default.
    When you call Date#toString(), the JavaScript runtime will use your ***OS' timezone***.
    */
    if(query.startDate || query.endDate){
        transaction_date = {}
        if(query.startDate) transaction_date['$gte'] = query.startDate;
        if(query.endDate) transaction_date['$lte'] = query.endDate;

        result.transaction_date = transaction_date;
    }
    // if category 
    if(query.category){
        result.category = query.category
    }
    if(query.transaction_type){
        result.transaction_type = query.transaction_type;
    }
    return result;
}

module.exports = filterQuery;