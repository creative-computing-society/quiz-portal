const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const questionController = require('./../controllers/questionController');

const router = express.Router();

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(authController.protect);

router.get(
  '/getQuestions',
  userController.getMe,
  questionController.getQuestions
);

// USER MUST BE A ADMIN TO ACCESS THE FOLLOWING ROUTES
router.use(authController.adminOnly);

router.post('/createQuestion', questionController.createQuestion);
router.get('/getAllQuestions', questionController.getAllQuestions);

module.exports = router;