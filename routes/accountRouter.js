const router = require('express').Router();
const accountController = require('../controllers').accounts

router.post('/', accountController.createAccount);
router.get('/:id', accountController.getAccount);
router.get('/', accountController.listAccounts);
router.patch('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
