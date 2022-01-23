const router = require('express').Router();
const transactionController = require('../controllers').transactions;
const {createTransaction, updateTransaction, isId } = require('../helpers').validator;
const validation = require('../middlewares').validation;

router.post('/', validation(createTransaction), transactionController.createTransaction);
router.get('/:id', validation(isId) ,transactionController.getTransaction);
router.get('/', transactionController.listTransactions);
router.patch('/:id', validation(isId), validation(updateTransaction), transactionController.updateTransaction);
router.delete('/:id', validation(isId), transactionController.deleteTransaction);

module.exports = router;
