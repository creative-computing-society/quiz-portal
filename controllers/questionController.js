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
  try {
    // GETTING THE LOGGED IN USER
    const user = await User.findById(req.params.id);
    let assignedQuestions = [];

    for (const questionNo of user.assignedQuestions) {
      const currentQuestion = Question.find({
        questionNumber: questionNo,
      });
      assignedQuestions.push(currentQuestion);
    }

    // RESOLVING ALL QUESTIONS AT THE SAME TIME FOR FASTER RESPONSE
    assignedQuestions = await Promise.all(assignedQuestions);

    res.status(200).json({
      status: 'success',
      data: {
        questions: assignedQuestions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      err: err.message,
    });
  }
};
