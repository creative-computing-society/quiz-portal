const mongoose = require('mongoose');
const validator = require('validator');

// A USER MUST SEND HIS NAME, EMAIL, PHONE NUMBER, BRANCH AND PASSWORD
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    // EMAIL SHOULD BE UNIQUE
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    // TO VERIFY THAT THE STRING SENT IS ACTUALLY AN EMAIL
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    // PHONE NUMBER MUST ALSO BE UNIQUE
  },
  branch: {
    type: String,
    required: [true, 'Please provide your branch'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    // LENGTH OF PASSWORD SHOULD BE BETWEEN 6 AND 20 CHARACTERS
    minlength: 6,
    maxLength: 20,
  },
  techStack: {
    type: String,
    required: [true, 'Please provide your tech stack'],
  },
  score: {
    type: Number,
    default: 0,
  },
  cheatAttempts: {
    type: Number,
    default: 0,
  },
  assignedQuestions: {
    type: Array,
  },
  shift: {
    type: Number,
    required: [true, 'A user mush have a shift'],
    min: [1, 'Shift can only be one or two'],
    max: [2, 'Shift can only be one or two'],
  },
});

// CREATING AN OBJECT USER BASED ON THE USER SCHEMA
const User = mongoose.model('User', userSchema);

// EXPORTING THE USER OBJECT
module.exports = User;
