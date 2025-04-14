const express= require('express');
const router= express.Router();

const {createQuestion, getAllQuestions}= require('../controllers/quiz.controller');


// Create a new question
router.post("/createQuestion",  createQuestion);

//Get All Questions
router.get("/getAllQuestions",  getAllQuestions);

module.exports = router; 