const {
  validateUser,
  signup,
  authenticate,
  listUsers,
  search,
  find,
  sendMail,
  upDatePassword,
  deleteUser,
  editUser,
  getUsersOfCurrentPage
} = require('./controllers/users');
const {
  loadQuestions,
  questionValidate,
  createQuestion,
  show,
  listQuestions,
  listByTags,
  listByUser,
  removeQuestion,
  findQuestion,
  sortQuestion
} = require('./controllers/questions');
const {
  loadAnswers,
  answerValidate,
  createAnswer,
  removeAnswer
} = require('./controllers/answers');
const { listPopulerTags, searchTags, listTags } = require('./controllers/tags');
const { upvote, downvote, unvote,chekVote } = require('./controllers/votes');
const { loadComments, validate, createComment, removeComment } = require('./controllers/comments');

const requireAuth = require('./middlewares/requireAuth');
const questionAuth = require('./middlewares/questionAuth');
const commentAuth = require('./middlewares/commentAuth');
const answerAuth = require('./middlewares/answerAuth');

const router = require('express').Router();

//authentication
router.post('/signup', validateUser, signup);
router.post('/authenticate', validateUser, authenticate);

//users
router.get('/users', listUsers);
router.get('/users/:search', search);
router.get('/user/find', find);
router.post('/user/sendEmail',sendMail);
router.put('/user/upDatePass',upDatePassword);

//users in admin
router.get('/user?', getUsersOfCurrentPage);
router.post('/user/addUser', signup);
router.post('/user/:username', editUser);
router.delete('/user/deleteUser/:username', deleteUser);


//questions
router.param('question', loadQuestions);
router.post('/questions', [requireAuth, questionValidate], createQuestion);
router.get('/question/:question', show);
router.get('/question', listQuestions);
router.get('/questions/:tags', listByTags);
router.get('/question/user/:username', listByUser);
router.delete('/question/:question', [requireAuth, questionAuth], removeQuestion);
router.get('/question/find/:keyWord',findQuestion);
//questions in admin
router.get('/questions?', getQuestionsOfCurrentPage);
//tags
router.get('/tags/populertags', listPopulerTags);
router.get('/tags/:tag', searchTags);
router.get('/tags', listTags);

//answers
router.param('answer', loadAnswers);
router.post('/answer/:question', [requireAuth, answerValidate], createAnswer);
router.delete('/answer/:question/:answer', [requireAuth, answerAuth], removeAnswer);
//answers in admin
router.get('/allAnswers/:question', getAllAnswers);
router.get('/answers/:question?', getAnswersOfCurrentPage);
//votes
router.get('/votes/upvote/:question/:answer?', requireAuth, upvote);
router.get('/votes/downvote/:question/:answer?', requireAuth, downvote);
router.get('/votes/unvote/:question/:answer?', requireAuth, unvote);
router.get('/votes/checkvote/:question/:answer?', requireAuth, chekVote);

//comments
router.param('comment', loadComments);
router.post('/comment/:question/:answer?', [requireAuth, validate], createComment);
router.delete('/comment/:question/:comment', [requireAuth, commentAuth], removeComment);
router.delete('/comment/:question/:answer/:comment', [requireAuth, commentAuth], removeComment);
//comments in admin
router.get('/allComments/:question', getAllComments);
router.get('/allComments/:question/:answer', getAllComments);
router.get('/comments/:question?', getCommentsOfCurrentPage);
router.get('/comments/:question/:answer/?', getCommentsOfCurrentPage);
module.exports = (app) => {
  app.use('/api', router);

  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      message: error.message
    });
  });
};
