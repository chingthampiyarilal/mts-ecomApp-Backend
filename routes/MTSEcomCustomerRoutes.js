const express = require('express');
const {registerController, loginController, authController, logoutController, getUserController, getUserListController, modifyUserController, deleteUserController, getUserDetailsController, updateProfileController} = require('../controllers/MTSEcomCustomerController')
const router = express.Router();

const authMiddleware = require('../middleware/middleware')

router.post("/signUp", registerController);
router.get('/user/:EmailID',getUserController);
router.get('/usersList',getUserListController);
// router.get('/user/:userId', getUserDetailsController);
router.put('/updateUser/:EmailID', modifyUserController);
router.delete('/user/:EmailID', deleteUserController);
router.post('/signIn', loginController);
router.post('/logout', logoutController)
router.post("/updateProfile", updateProfileController);

router.post('/getUserData', authMiddleware, authController)

module.exports = router;
