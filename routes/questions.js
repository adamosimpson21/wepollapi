const express = require("express");
const router = express.Router({mergeParams:true});
const { loginRequired, ensureCorrectUser } = require('../middleware/auth')
const { createQuestion,
        getQuestion,
        deleteQuestion,
        getAllQuestions,
        updateQuestion,
        answerQuestion,
        changePriority} = require("../handlers/questions")

router.route("/")
  .get(getAllQuestions)

router.route("/:id")
  .all(loginRequired, ensureCorrectUser)
  .post(createQuestion)

router.route("/:id/:question_id")
  .get(getQuestion)
  .put(loginRequired,
    ensureCorrectUser,
    changePriority)
  .delete(ensureCorrectUser,
    loginRequired,
    deleteQuestion)
  .post(ensureCorrectUser,
    loginRequired,
    answerQuestion)

module.exports = router;