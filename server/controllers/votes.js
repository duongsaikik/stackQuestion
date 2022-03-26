const User = require('../models/user');
exports.upvote = async (req, res) => {
  const { id } = req.user;

  if (req.answer) { 
    req.answer.vote(id, 1);   
     //update author score
     const user = await User.findByIdAndUpdate(
      req.answer.author, { $inc: { score: req.answer.score } },
  );
    const question = await req.question.save();
    return res.json(question);
  }
 //update author score
 await User.findByIdAndUpdate(
  req.question.author, { $inc: { score: -req.question.score } },
);
  const question = await req.question.vote(id, 1);
  //update author score
  const user = await User.findByIdAndUpdate(
    req.question.author, { $inc: { score: req.question.score } },
);
  return res.json(question);
};

exports.downvote = async (req, res) => {
  const { id } = req.user;

  if (req.answer) {
    //update author score
    await User.findByIdAndUpdate(
      req.answer.author, { $inc: { score: -req.answer.score } },
  );
    req.answer.vote(id, -1); 
    const question = await req.question.save();
    //update author score
    await User.findByIdAndUpdate(
      req.answer.author, { $inc: { score: req.answer.score } },
  );
    return res.json(question);
  }
  //update author score
  await User.findByIdAndUpdate(
    req.question.author, { $inc: { score: -req.question.score } },
);
  const question = await req.question.vote(id, -1);
   //update author score
   const user = await User.findByIdAndUpdate(
    req.question.author, { $inc: { score: req.question.score } },
);

  return res.json(question);
};

exports.unvote = async (req, res) => {
  const { id } = req.user;

  if (req.answer) {
     //update author score
     await User.findByIdAndUpdate(
      req.answer.author, { $inc: { score: -req.answer.score } },
  );
    req.answer.vote(id, 0);
    const question = await req.question.save();
      //update author score
      await User.findByIdAndUpdate(
        req.answer.author, { $inc: { score: req.answer.score } },
    );
    return res.json(question);
  }
  //update author score
  await User.findByIdAndUpdate(
    req.question.author, { $inc: { score: -req.question.score } },
);
  const question = await req.question.vote(id, 0);
  //update author score
  await User.findByIdAndUpdate(
    req.question.author, { $inc: { score: req.question.score } },
);
  return res.json(question);
};
exports.chekVote = async (req,res) =>{
  const {id} = req.user;

  console.log(req.answer)
    req.answer.checkeds(id, true);
  req.question.checkeds(id, true);
  const question = await req.question.save();
  return res.json(question);  
}
exports.report = async (req,res) =>{
  
    const {id, email, username} = req.user;
 
    req.question.reportQt(id, email, username);
  const question = await req.question.save();
  return res.json(question);    
}
exports.removeReport = async (req,res) =>{
  const {question,id} = req.params;
  
   req.question.removeReport(id);
  const questions = await req.question.save();
  return res.json(questions); 
}