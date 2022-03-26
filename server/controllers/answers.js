const { body, validationResult } = require('express-validator');
const Question = require('../models/question');
const User = require('../models/user');
const lodash = require('lodash');
const initialScore = 0;
exports.loadAnswers = async (req, res, next, id) => {
  try {
    const answer = await req.question.answers.id(id);
    if (!answer) return res.status(404).json({ message: 'Answer not found.' });
    req.answer = answer;
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid answer id.' });
    return next(error);
  }
  next();
};

exports.createAnswer = async (req, res, next) => {

  const result = validationResult(req);

  if (!result.isEmpty()) {

    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { id } = req.user;
    const { text } = req.body;

    const question = await req.question.addAnswer(id, text);
    //increase user answersMount
    const user = await User.findByIdAndUpdate(
      id, { $inc: { answersMount: 1, score: initialScore } },
    );
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

exports.removeAnswer = async (req, res, next) => {
  try {
    
    const { answer } = req.params;
   
    const user = await User.findById(req.user.id);
   
     user.answersMount -=1;
 
    
       //decrease user answer mount
      /*  await User.findByIdAndUpdate(
        req.user.id, { $inc: { answersMount: -1, score: -req.question.answers.score } },
    ); */
 
      const question = await req.question.removeAnswer(answer);
    user.save();
    res.json(question);   
  } catch (error) {
    next(error);
  }
};

exports.answerValidate = [
  body('text')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    /* .isLength({ min: 30 })
    .withMessage('must be at least 30 characters long') */

    .isLength({ max: 30000 })
    .withMessage('must be at most 30000 characters long')
];
exports.getAllAnswers = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.question);
    const answers = question.answers;
    res.json(answers);
  } catch (error) {
    next(error);
  }
};
exports.getAnswersOfCurrentPage = async (req, res) => {
  const PAGE_SIZE = 5;
  const page = parseInt(req.query.page || '0');
  const sort = req.query.sort || '';
  try {
    const question = await Question.findById(req.params.question);
    const allAnswers = question.answers;
    const total = allAnswers.length;

    const answers = lodash.sortBy(allAnswers, [sort]).slice(PAGE_SIZE * page, PAGE_SIZE);
    res.status(200).json({ totalPages: Math.ceil(total / PAGE_SIZE), answers });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
