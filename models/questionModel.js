const mongoose = require('mongoose');

// A QUESTION REQUEST SHOULD CONTAIN THE QUESTION, THE OPTIONS, THE CORRECT ANSWERAND THE DIFFICULTY OF THE QUESTION
const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  question: {
    type: String,
    required: [true, 'Please enter a question!'],
    unique: true,
  },
  // ARRAY OF OPTIONS
  options: [
    {
      type: String,
      required: [true, 'Please enter first option!'],
    },
    {
      type: String,
      required: [true, 'Please enter second option!'],
    },
    {
      type: String,
      required: [true, 'Please enter third option!'],
    },
    {
      type: String,
      required: [true, 'Please enter fourth option!'],
    },
  ],
  answer: {
    type: Number,
    required: [true, 'A question must have an option!'],
    min: [1, 'Correct option number must be between 1 and 4'],
    max: [4, 'Correct option number must be between 1 and 4'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Difficulty is either: easy, medium or hard',
    },
  },
});

// VIRTUAL PROPERTY TO AUTOMATICALLY ASSIGN POINTS BASED ON QUESTION DIFFICULTY
questionSchema.virtual('points').get(function () {
  if (this.difficulty === 'easy') return 2;
  else if (this.difficulty === 'medium') return 3;
  else return 4;
});

// MAKING A QUESTION OBJECT BASED UPON THE QUESTION SCHEMA
const Question = mongoose.model('Question', questionSchema);

// EXPORTING QUESTION OBJECT
module.exports = Question;
