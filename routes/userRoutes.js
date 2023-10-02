const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// router.patch('/changeShift', userController.changeShift);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(authController.protect);

router.get('/profile', userController.getMe, userController.getUserProfile);
router.get('/getPoints', userController.getMe, userController.getPoints);
router.patch(
  '/cheatAttempt',
  userController.getMe,
  userController.cheatAttempt
);

// USER MUST BE A ADMIN TO ACCESS THE FOLLOWING ROUTES
router.use(authController.adminOnly);

router.get('/leaderboard', userController.leaderboard);

module.exports = router;