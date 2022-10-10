const User = require('./../models/userModel');
const Question = require('./../models/questionModel');
const AppError = require('./../utils/appError');

// FUNCTION TO FILTER OBJECT
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ROUTE TO CHECK WHETHER ANSWER IS CORRECT AND UPDATE POINTS ACCORDINGLY
exports.checkAnswers = async (req, res, next) => {
  try {
    // 1) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'questionIdsAndAnswers');

    // 2) Get questionIds , answers and User ID from request
    const { questionIdsAndAnswers } = filteredBody;
    const userId = req.params.id;
    if (!questionIdsAndAnswers || !userId) {
      res.status(400).json({
        status: 'failed',
        err: 'No question IDs , answers , or user ID was provided',
      });
      return next();
    }

    // Variable to store question number and answers
    let answers = [];

    // Find user
    const user = await User.findById(userId);

    // In case no matching user exists
    if (!user) {
      res.status(400).json({
        status: 'failed',
        err: 'No user matching the userId found',
      });
      return next();
    }

    // Declaring variable to store new score and setting it to zero as answers will only be submitted once
    let newScore = 0;

    for (const questionIdAndAnswer of questionIdsAndAnswers) {
      // Find question from the provided question Ids
      let question = await Question.findById(questionIdAndAnswer[0]);
      // In case no matching question exists
      if (!question) {
        res.status(400).json({
          status: 'failed',
          err: 'No question matching the questionId found',
        });
        return next();
      }

      // Store question number and answer in array
      answers.push({
        questionNumber: question.questionNumber,
        givenAnswer: questionIdAndAnswer[1],
        correctAnswer: question.answer,
        difficulty: question.difficulty,
      });

      // Match correct answer to question with the marked answer
      if (question.answer === questionIdAndAnswer[1])
        newScore += question.points;
      else newScore -= 1;
    }

    // Update user score
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        score: newScore,
        answers,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // Send the final score as response
    res.status(200).json({
      status: 'success',
      result: newScore,
      answers,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      err: err.message,
    });
  }
};
