const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const questionController = require('./../controllers/questionController');

const router = express.Router();

router.post('/createQuestion', questionController.createQuestion);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(authController.protect);

router.get(
  '/getQuestions',
  userController.getMe,
  questionController.getQuestions
);

module.exports = router;
