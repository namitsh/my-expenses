const router = require('express').Router();
const transactionController = require('../controllers').transactions

router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getTransaction);
router.get('/', transactionController.listTransactions);
router.patch('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
