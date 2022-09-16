const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const userotp = require('../models/userotp');
const User = require('../models/userModel');

const router = express.Router();

//otp verify
router.post('/verifyEmail',authController.verifyEmail);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(authController.protect);

router.get('/profile', userController.getMe, userController.getUserProfile);
router.get('/getPoints', userController.getMe, userController.getPoints);
router.patch(
  '/cheatAttempt',
  userController.getMe,
  userController.cheatAttempt
);

module.exports = router;
