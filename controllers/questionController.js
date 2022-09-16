const User = require('../models/userModel');
const Question = require('./../models/questionModel');

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

exports.getQuestions = async (req, res, next) => {
  // GETTING THE LOGGED IN USER
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      questions: user.assignedQuestions,
    },
  });
};
