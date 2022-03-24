const Question = require('../models/question');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const fullTextSearch = require('fulltextsearch');
var fullTextSearchVi = fullTextSearch.vi;
const getPagination = (page, size, data) => {

  const start = page ? + (page - 1) * size : 0;
  const end = size ? page * size : 10;
  const dataInPer = data.slice(start, end);
  const pagePer = Math.ceil(data.length / size);
  return { dataInPer, pagePer };
};

exports.loadQuestions = async (req, res, next, id) => {
  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found.' });
    req.question = question;
  } catch (error) {
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid question id.' });
    return next(error);
  }
  next();
};

exports.createQuestion = async (req, res, next) => {
  /* const result = validationResult(req);
  
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  } */
  try {
    const { title, tags, text } = req.body;
      console.log(tags)
    const author = req.user.id;
    const question = await Question.create({
      title,
      author,
      tags,
      text
    });
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.question;
    const question = await Question.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('answers');
  
    res.json(question);
  } catch (error) {
    next(error);
  }
};

exports.listQuestions = async (req, res, next) => {
  try {
    const { sortType = '-created' } = req.body;
    const { page, size,requestType } = req.query;
    
    if(requestType){
      switch (requestType) {
        case 'Votes':
          {
            const questions = await Question.find().sort('-score');
                const { dataInPer, pagePer } = getPagination(page, size, questions);
                return  res.json({
                  currentPage: Number(page),
                  pageNum: pagePer,
                  data: dataInPer
                });
         
          }
         
          case 'Oldest':
            {
         
             const questions = await Question.find().sort('created');
                const { dataInPer, pagePer } = getPagination(page, size, questions);
                return  res.json({
                  currentPage: Number(page),
                  pageNum: pagePer,
                  data: dataInPer
                });
            
            }
         
            case 'Views':
              {
                const questions = await Question.find().sort('-views');
               
             
                const { dataInPer, pagePer } = getPagination(page, size, questions);
                return  res.json({
                  currentPage: Number(page),
                  pageNum: pagePer,
                  data: dataInPer
                });
           
              }
             
        default:
          {
            const questions = await Question.find().sort(sortType);
                const { dataInPer, pagePer } = getPagination(page, size, questions);               
                return  res.json({
                  currentPage: Number(page),
                  pageNum: pagePer,
                  data: dataInPer
                });
            
          }
      }
    }
    else{
      
      const questions = await Question.find().sort(sortType);
      const { dataInPer, pagePer } = getPagination(page, size, questions);
  
      res.json({
        currentPage: Number(page),
        pageNum: pagePer,
        data: dataInPer
      });
    }
   
  } catch (error) {
    next(error);
  }
};

exports.listByTags = async (req, res, next) => {
  try {
    const { sortType = '-score', tags } = req.params;
    const questions = await Question.find({ tags: { $all: tags } }).sort(sortType);
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

exports.listByUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { sortType = '-created' } = req.body;
    const author = await User.findOne({ username });
    const questions = await Question.find({ author: author.id }).sort(sortType).limit(10);
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

exports.removeQuestion = async (req, res, next) => {
  try {
    await req.question.remove();
    res.json({ message: 'Your question successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.loadComment = async (req, res, next, id) => {
  try {
    const comment = await req.question.comments.id(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    req.comment = comment;
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid comment id.' });
    return next(error);
  }
  next();
};
exports.findQuestion = async (req, res, next) => {
  try {
    const keyWord = await req.params.keyWord;
    const { page, size } = req.query;
  
   /*  if (req.query.screen_name != '') {
        filter.screen_name = new RegExp(req.query.screen_name, "i");
    }
    if (req.query.location != '') {
        filter.location = new RegExp(fullTextSearchVi(req.query.location), "i");
    }
    if (req.query.status != '') {
        filter.description = new RegExp(fullTextSearchVi(req.query.description), "i");
    } */

 /*  const as = await  Question.find(filter) *//* .toArray(function (err, result) {
        if (err != null) {
            req.flash('danger', err.message);
        }
        console.log(result)
         res.setHeader('Content-Type', 'application/json');
         return res.status(200).json({data: result});      
    }); */
    //
    if (keyWord) {
      var filter = {};
      var f = {};   
        filter.title = new RegExp(fullTextSearchVi(keyWord), "i")  
        f.text = new RegExp(fullTextSearchVi(keyWord), "i")  
       
   /*   const questions = await Question.find({"title": new RegExp('.*' + keyWord + '.*')}) */
     const questions = await  Question.find(filter)
     const question = await  Question.find(f);
     if(questions.length == 0){
      const { dataInPer, pagePer } = getPagination(page, size, question);
      return res.status(200).json({
        currentPage: Number(page),
        pageNum: pagePer,
        data: dataInPer
      });
     }else{
      const { dataInPer, pagePer } = getPagination(page, size, questions);
      return res.status(200).json({
        currentPage: Number(page),
        pageNum: pagePer,
        data: dataInPer
      });
     }
     
       
    }
  } catch (error) {
    return next(error);
  }
}
exports.questionValidate = [
  body('title')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 180 })
    .withMessage('must be at most 180 characters long'),

  body('text')
    .exists()
    .trim()
    .withMessage('is required')

    .isLength({ min: 10 })
    .withMessage('must be at least 10 characters long')

    .isLength({ max: 5000 })
    .withMessage('must be at most 5000 characters long'),

  body('tags').exists().withMessage('is required')
];
exports.getQuestionsOfCurrentPage = async (req, res) => {
  const PAGE_SIZE = 5;
  const page = parseInt(req.query.page || '0');
  const sort = req.query.sort || '';
  try {
    const total = await Question.countDocuments({});
    const questions = await Question.find()
      .sort(sort)
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    res.status(200).json({ totalPages: Math.ceil(total / PAGE_SIZE), questions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};