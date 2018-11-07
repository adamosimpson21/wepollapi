const db = require("../models")

const populateDemographics = {path : 'results', populate: { path: 'user', select :'age familySize gender income location race education' }}

exports.createQuestion = async function(req, res, next){
  try{
    const { title, questionContent, description, education, tags, answers } = req.body
    let question = await db.Question.create({
      title,
      education,
      tags,
      questionContent,
      description,
      answers,
      author:req.params.id
    })
    let foundUser = await db.User.findById(req.params.id)
    foundUser.authored.push(question.id);
    await foundUser.save()
    let foundQuestion = await db.Question.findById(question._id)
      .populate("user", {
        username: true
      })
    return res.status(200).json(foundQuestion);
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
    let questions = await db.Question.find({})
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
    let foundQuestion = await db.Question.findById(req.params.question_id)
    await foundQuestion.remove();
    return res.status(200).json(foundQuestion)
  } catch(err){
    return next(err);
  }
}

exports.answerQuestion = async function(req, res, next){
  try{
    // TODO: There are a lot more things to include here. Not finished at all
    let question = await db.Question.findById(req.params.question_id)
    let user = await db.User.findById(req.params.id)
    let result = await db.Result.create({question:question._id, user:user._id, answer:req.body.answer})
    let message = null
    Number.isInteger(question.xpReward) ? user.experience += question.xpReward : null
    user.results.push(result)
    const coinsToEarn = 5;
    user.coins += coinsToEarn
    message = `You've earned ${coinsToEarn} Opinion Points`;
    user.questions.push(question._id)
    question.results.push(result._id)
    await user.save();
    await question.save();
    let populatedQuestion =  await db.Question.findById(req.params.question_id).populate(populateDemographics).populate('author', {username:true})
    let response = {}
    response.message = message;
    response.user = user;
    response.question = populatedQuestion;
    return res.status(200).json(response);
  } catch(err){
    return next(err);
  }
}

module.exports = exports;