const User = require('../models/userModel');
const Question = require('./../models/questionModel');

// FUNCTION TO SHUFFLE AN ARRAY
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// ROUTE TO CREATE A QUESTION
exports.createQuestion = async (req, res, next) => {
  try {
    const newQuestion = await Question.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        newQuestion,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      err: err.message,
    });
  }
};

// ROUTE TO GET ALL STORED QUESTIONS
exports.getAllQuestions = async (req, res, next) => {
  try {
    // GETTING ALL QUESTIONS
    const questions = await Question.find();

    res.status(200).json({
      status: 'success',
      questions,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      err: err.message,
    });
  }
};

// ROUTE TO GET QUESTIONS FOR THE LOGGED IN USER
exports.getQuestions = async (req, res, next) => {
  try {
    // GETTING THE LOGGED IN USER
    const user = await User.findById(req.params.id);

    // IF THE USER SEARCHES FOR QUESTIONS FOR THE FIRST TIME
    if (!user.beenAssigned) {
      // GET ALL QUESTIONS
      const easy = Question.find({ difficulty: 'easy', slot: user.shift });
      const medium = Question.find({ difficulty: 'medium', slot: user.shift });
      const hard = Question.find({ difficulty: 'hard', slot: user.shift });

      // RESOLVE PROMISES SIMULTANEOUSLY TO REDUCE WAITING TIME
      const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all(
        [easy, medium, hard]
      );

      const assignedQuestions = [
        ...shuffleArray(easyQuestions).slice(0, 4),
        ...shuffleArray(mediumQuestions).slice(0, 3),
        ...shuffleArray(hardQuestions).slice(0, 3),
      ];

      let newAssignedQuestions = assignedQuestions.map((question) => ({
        _id: question._id,
        question: question.question,
        options: question.options,
      }));

      // Update user score and mark that he has attempted the test
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          beenAssigned: true,
          newAssignedQuestions,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // RETURN THE QUESTIONS WHICH HAVE JUST BEEN ASSIGNED TO THE USER
      res.status(200).json({
        status: 'success',
        data: {
          questions: newAssignedQuestions,
        },
      });
    } else {
      // RETURN THE QUESTIONS ASSIGNED TO THE USER
      res.status(200).json({
        status: 'success',
        data: {
          questions: user.newAssignedQuestions,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      err: err.message,
    });
  }
};
