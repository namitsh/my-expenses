const router = require('express').Router();
const userController = require('../controllers').users;
const auth = require('../middlewares').auth

router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/:id', auth.isAuthorized, userController.getUser);
router.patch('/:id/updatePassword', auth.isAuthorized, userController.updateUserPassword);
// TODO: DELETE USER MEANS DELETE ALL ITS DATA.
// router.delete('/', auth.isAuthorized, userController.deleteUser);

module.exports = router;