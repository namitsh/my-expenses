const chai = require('chai');
const expect = chai.expect;
const mongoID = require('../config').mongodb.mongoID()

const Transaction = require('./transaction');

describe('Transaction Model', ()=>{
    it('should not create a transaction with required values', ()=>{
        let transaction = new Transaction({
            account: mongoID, 
            amount: 20,
            transaction_type: "expense"
        })
        expect(transaction).to.have.property('account');
        expect(transaction).to.have.property('amount').to.equal(20);
        expect(transaction).to.have.property('transaction_type').to.equal('expense');
    });
    it('should create a transaction with no required values', (done)=>{
        let transaction = new Transaction();
        transaction.validate((err)=>{
            expect(err.errors.account).to.exist;
            expect(err.errors.amount).to.exist;
            expect(err.errors.transaction_type).to.exist;
            done();
        });
    });
    it('should create a transaction with no required values', (done)=>{
        let transaction = new Transaction();
        transaction.validate((err)=>{
            expect(err.errors.account).to.exist;
            expect(err.errors.amount).to.exist;
            expect(err.errors.transaction_type).to.exist;
            done();
        });
    });
    it('should not create a transaction with negative amount', (done)=>{
        let transaction = new Transaction({
            account: mongoID, 
            amount: -20,
            transaction_type: "expense"
        })
        transaction.validate((err)=>{
            expect(err.errors.amount).to.exist;
            expect(err.errors.amount.message).to.equal('Invalid Amount');
            done();
        })
    });
    it('should not create transaction with invalid transaction_type', (done)=>{
        let transaction = new Transaction({
            account: mongoID, 
            amount: -20,
            transaction_type: "invalid"
        })
        transaction.validate((err)=>{
            expect(err.errors.transaction_type).to.exist;
            done();
        })
    });
});