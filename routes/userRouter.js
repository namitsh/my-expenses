const router = require('express').Router();
const userController = require('../controllers').users;

router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.getUser);
router.patch('/:id/updatePassword', userController.updateUserPassword);
// TODO: DELETE USER MEANS DELETE ALL ITS DATA.
// router.delete('/', userController.deleteUser);

module.exports = router;