const router = require('express').Router();
const accountController = require('../controllers').accounts
const { account, isId } = require('../helpers').validator
const {validation} = require('../middlewares')

router.post('/', validation(account), accountController.createAccount);
router.get('/:id', validation(isId), accountController.getAccount);
router.get('/', accountController.listAccounts);
router.patch('/:id', validation(account), accountController.updateAccount);
router.delete('/:id', validation(isId), accountController.deleteAccount);

module.exports = router;
