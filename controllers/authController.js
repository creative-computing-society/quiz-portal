const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const Question = require('./../models/questionModel');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { sendCodeMail } = require('./mailController');
const { imageDecode } = require('./imageController');

// INITIALIZING PATH TO .CONFIG FILE
dotenv.config({ path: './config.env' });

// CREATING TRANSPORTER FOR NODEMAILER
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// CREATE SIGN TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// FUNCITON TO SEND OTP IN MAIL
const sendOTP = async (email, generatedOTP) => {
  try {
    let mailOptions = {
      from: 'ccs@thapar.edu',
      to: email,
      subject: 'Password for CCS Recruitment Test',
      html: `<p>Thank you for registering!!<br> Your Password for Test Portal Login is:</p> <b>${generatedOTP}</b> <br> and your email id is <b>${email}</b>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    return true;
  }
};

// GLOBAL VARIABLE TO DIVIDE REGISTRATIONS INTO SLOT 1 AND 2
let i = 0;

// SHUFFLE ARRAY
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// CREATE TOKEN TO BE SENT TO BE ASSIGNED TO THE USER
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
    let shift = 1;
    // IF GLOBAL VARIABLR I IS EVEN USER IS ASSIGNED SHIFT TWO
    if (i % 2 === 0) shift = 2;

    // GENERATE OTP TO SAVE AS PASSWORD
    const otp = `${Math.floor(Math.random() * 8999) + 1000}`;

    // const err = sendOTP(req.body.email, otp);
    const isAdmin =
      req.body.isAdmin && req.body.adminPassword === process.env.ADMIN_PASSWORD;

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      branch: req.body.branch,
      applicationNumber: req.body.applicationNumber,
      password: otp,
      shift,
      links: req.body.links,
      nonTechFields: req.body.nonTechFields,
      nonTechLinks: req.body.nonTechLinks,
      techStack: req.body.techStack,
      isAdmin,
    });
    imageDecode(req.body.image, newUser.name+"_"+newUser.applicationNumber);
    let time="21:30 p.m.";
    if(shift===2) time="22:30 p.m.";
    sendCodeMail(req.body.email, req.body.name, otp,time);
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

exports.adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin === true) {
      return next();
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'You are not an admin',
      });
    }
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: 'You are not an admin',
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
      return;
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      res.status(401).json({
        status: 'failed',
        message: 'Incorrect email or password',
      });
      return;
    }

    if (user.cheatAttempts >= 3) {
      res.status(401).json({
        status: 'failed',
        message:
          'You have been disqualified as you have been caught cheating three times.',
      });
      return;
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