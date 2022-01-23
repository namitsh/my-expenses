const router = require('express').Router();
const userController = require('../controllers').users;
const {auth, validation} = require('../middlewares')
const { createUser, loginUser, updatePassword  } = require('../helpers').validator

router.post('/', validation(createUser),userController.createUser);
router.post('/login', validation(loginUser), userController.loginUser);
router.get('/:id', auth.isAuthorized, validation(updatePassword),  userController.getUser);
router.patch('/:id/updatePassword', auth.isAuthorized, userController.updateUserPassword);
// TODO: DELETE USER MEANS DELETE ALL ITS DATA.
router.delete('/', auth.isAuthorized, userController.deleteUser);

module.exports = router;