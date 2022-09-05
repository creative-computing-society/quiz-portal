// const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const { response } = require('express');

const questionArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
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
    console.log(req.body);
    questionArray.sort((a, b) => 0.5 - Math.random());
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      branch: req.body.branch,
      password: req.body.password,
      techStack: req.body.techStack,
      assignedQuestions: questionArray,
    });

    createSendToken(newUser, 201, res);
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
      console.log('if');
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
