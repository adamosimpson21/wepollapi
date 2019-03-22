const db = require("../models")

const populateDemographics = {path : 'results', populate: { path: 'user', select :'age familySize gender income location race education' }}

exports.createQuestion = async function(req, res, next){
  try{
    const { title, questionContent, description, education, tags, answers, answerType } = req.body
    let question = await db.Question.create({
      title,
      education,
      tags,
      questionContent,
      description,
      answers,
      answerType,
      author:req.params.id
    })
    let user = await db.User.findByIdAndUpdate(req.params.id, {$push:{authored:question.id}}, {new:true})
    let response = {message: "Question " + title + " created successfully.", user}
    return res.status(200).json(response);
  } catch(err){
    return next(err);
  }
}

exports.getQuestion = async function(req, res, next){
  try{
    let question = await db.Question.findById(req.params.question_id)
      .populate('author', {username:true})
      .populate(populateDemographics)
    return res.status(200).json(question)
  } catch(err){
    return next(err);
  }
}

exports.getAllQuestions = async function(req, res, next){
  try{
    let questions = await db.Question.find()
    return res.status(200).json(questions)
  } catch(err){
    return next(err);
  }
}

exports.updateQuestion = async function(req, res, next){
  try{
    let question = await db.Question.findById(req.params.iq)
    return res.status(200).json(question)
  } catch(err){
    return next(err);
  }
}

exports.deleteQuestion = async function(req, res, next){
  try{
    await db.Question.findByIdAndRemove(req.params.question_id)
    return res.status(200).json()
  } catch(err){
    return next(err);
  }
}

exports.answerQuestion = async function(req, res, next){
  try{
    // TODO: There are a lot more things to include here. Not finished at all
    const {answer, securityLevel} = req.body
    const {id, question_id} = req.params
    let question = await db.Question.findById(question_id)
    let user = await db.User.findById(id)
    let result = await db.Result.create({question:question._id, user:user._id, answer, securityLevel})
    let messages = []
    Number.isInteger(question.xpReward) && (user.experience += question.xpReward) && messages.push({message:`You've earned ${question.xpReward} Experience`, degree:"success"})
    // will change in the future, needs to be modular
    const coinsToEarn = 5;
    Number.isInteger(coinsToEarn) && (user.coins += coinsToEarn) && messages.push({message:`You've earned ${coinsToEarn} Opinion Points`, degree:"success"});
    user.results.push(result)
    user.questions.push(question._id)
    await user.save();
    let populatedQuestion =  await db.Question.findByIdAndUpdate(question_id, {$push:{results:result._id}}, {new: true}).populate(populateDemographics).populate('author', {username:true})
    let response = { messages, user, question:populatedQuestion};
    return res.status(200).json(response);
  } catch(err){
    return next(err);
  }
}

exports.changePriority = async function(req, res, next){
  try{
    return await db.Question.findByIdAndUpdate(req.params.question_id, {$set:{priority:req.body.priority}}, {new:true})
  } catch(err){
    return next(err);
  }
}

module.exports = exports;