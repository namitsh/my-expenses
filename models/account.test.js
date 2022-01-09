const chai = require('chai');
const expect = chai.expect;

const Account = require('./account');

describe('Account Model', ()=>{
    it('should return error of required are missing', (done)=>{
        let account = new Account();
        account.validate((err)=>{
            expect(err.errors.type).to.exist;
            expect(err.errors.name).to.not.exist;
            expect(err.errors.balance).to.not.exist;
            expect(err.errors.description).to.not.exist;
            done();
        })
    });
    it('should create an account with required field', ()=>{
        let account = new Account({
            type: "cash"
        })
        expect(account).to.have.property('type').to.equal("cash");
        expect(account).to.have.property('balance').to.equal(0);
    });
    it('should not create an account with negative balance', (done)=>{
        let account = new Account({
            type: "cash",
            balance: -5
        })
        account.validate((err)=>{
            expect(err.errors.balance).to.exist;
            expect(err.errors.balance.message).to.equal('Invalid Balance');
            done();
        })
    });
    it('should not create account with invalid type', (done)=>{
        let account = new Account({
            type: "invalid"
        })
        account.validate((err)=>{
            expect(err.errors.type).to.exist;
            done();
        })
    });
    it('should create an account with all fields', ()=>{
        let account = new Account({
            type: "cash",
            name: "random",
            balance: 55,
            description: "hello world"
        })
        expect(account).to.have.property('type').to.equal("cash");
        expect(account).to.have.property('balance').to.equal(55);
        expect(account).to.have.property('name').to.equal("random");
        expect(account).to.have.property('description').to.equal("hello world");
    });

})