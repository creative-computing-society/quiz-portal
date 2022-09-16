// const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const { response } = require('express');
const Question = require('./../models/questionModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

let i = 0;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// ROUTE TO SIGN UP
exports.signup = async (req, res, next) => {
  try {
    // GET ALL QUESTIONS
    const easy = Question.find({ difficulty: 'easy' });
    const medium = Question.find({ difficulty: 'medium' });
    const hard = Question.find({ difficulty: 'hard' });

    // RESOLVE PROMISES SIMULTANEOUSLY TO REDUCE WAITING TIME
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      easy,
      medium,
      hard,
    ]);

    const assignedQuestions = [
      shuffleArray(easyQuestions).slice(0, 4),
      shuffleArray(mediumQuestions).slice(0, 3),
      shuffleArray(hardQuestions).slice(0, 3),
    ];

    let shift = 1;
    // IF GLOBAL VARIABLR I IS EVEN USER IS ASSIGNED SHIFT TWO
    if (i % 2 === 0) shift = 2;

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      branch: req.body.branch,
      password: req.body.password,
      techStack: req.body.techStack,
      assignedQuestions,
      shift,
    });

    createSendToken(newUser, 201, res);
    // INCREMENTING i AFTER USER CREATION SO THAT SHIFTS ARE NOT DISTRIBUTED UNEVENLY IN CASE OF REQUEST FAILURES
    i++;
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err.message,
    });
  }
};

// ROUTE TO LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      res.status(400).json({
        status: 'failed',
        message: 'Please provide email and password!',
      });
      return next();
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email });

    if (!user || !(user.password === password)) {
      res.status(401).json({
        status: 'failed',
        message: 'Incorrect email or password',
      });
      return next();
    }

    if (user.cheatAttempts >= 3) {
      res.status(401).json({
        status: 'failed',
        message:
          'You have been disqualified as you have been caught cheating three times.',
      });
      return next();
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err.message,
    });
  }
};

// ROUTE TO LOGOUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// ROUTE TO CHECK WHETHER THE USER IS LOGGED IN
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      res.status(401).json({
        status: 'failed',
        message: 'You are not logged in! Please log in to get access.',
      });
      return next();
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        status: 'failed',
        message: 'The user belonging to this token does no longer exist.',
      });
      return next();
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: 'You are not logged in! Please log in to get access.',
    });
    return next();
  }
};
