const { response } = require('express');
const User = require('./../models/userModel');

// ROUTE TO PUT USER ID IN URL PARAMETERS
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.leaderboard = async (req, res, next) => {
  try {
    // FILTER USERS WITH CHEAT ATTEMPTS LESS THAN 3 THEN SORT ON THE BASIS OF SCORE IN DESCENDING ORDER
    const users = await User.find()
      .where('cheatAttempts')
      .lte(2)
      .sort({ score: -1 });

    // SEND NUMBER OF NOT-DISQUALIFIED MEMBERS AND LEADERBOARD
    res.status(200).json({
      status: 'success',
      results: users.length,
      users,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err.message,
    });
  }
};

// ROUTE TO GET USER DATA TO DISPLAY IN PROFILE PAGE
exports.getUserProfile = async (req, res, next) => {
  try {
    // FINDING CURRENT USER
    const user = await User.findById(req.params.id);

    // IN CASE USER IS NOT FOUND
    if (!user) {
      res.status(400).json({
        status: 'failed',
        error: 'No user matching that id found',
      });
      return next();
    }

    // SENDING DATA REQUIRED FOR PROFILE PAGE
    res.status(200).json({
      status: 'success',
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        branch: user.branch,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err.message,
    });
  }
};

// ROUTE TO GET USER POINTS
exports.getPoints = async (req, res, next) => {
  try {
    // FINDING CURRENT USER
    const user = await User.findById(req.params.id);

    // IF USER ID DOES NOT MATCH
    if (!user) {
      res.status(400).json({
        status: 'failed',
        error: 'No user matching that id found',
      });
      return next();
    }

    // SEND SCORE IN RESPONSE
    res.status(200).json({
      status: 'success',
      score: user.score,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err.message,
    });
  }
};

// ROUTE TO INCREMENT NUMBER OF CHEAT ATTEMPTS
exports.cheatAttempt = async (req, res, next) => {
  // FINDING CURRENT USER
  const user = await User.findById(req.params.id);

  // IN CASE USER IS NOT FOUND
  if (!user) {
    res.status(400).json({
      status: 'failed',
      error: 'No user matching that id found',
    });
    return next();
  }

  // ASSIGNING NEW NUMBER OF CHEAT ATTEMPTS TO A VARIABLE
  const incrementedCheatAttempt = user.cheatAttempts + 1;

  // SETTING ERROR MESSAGE
  let message = '';
  if (incrementedCheatAttempt == 1)
    message = 'Do not attempt to change tabs, you will be disqualified';
  else if (incrementedCheatAttempt == 2)
    message = 'This is your final warning, do not attempt to change tabs';
  else
    message =
      'You have been logged out on account of changing tabs multiple times';

  // UPDATING CHEAT ATTEMPTS OF THE USER
  await User.findByIdAndUpdate(
    req.params.id,
    {
      cheatAttempts: incrementedCheatAttempt,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // SENDING NEW CHEAT ATTEMPTS AND CORRESPONDING MESSAGE
  res.status(200).json({
    status: 'success',
    cheatAttempts: incrementedCheatAttempt,
    message,
  });
};
