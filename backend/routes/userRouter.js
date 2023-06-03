const express = require('express');
const { deleteManager ,registerUser, authUser, updateUserProfile, addManager, getManager } = require('../controllers/userController')
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware')


router.route('/').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').post(protect, updateUserProfile);
router.route('/addmanagers').post(addManager);
router.route('/getmanagers').get(getManager);
router.route('/deletemanager/:id').get(deleteManager);



module.exports = router;