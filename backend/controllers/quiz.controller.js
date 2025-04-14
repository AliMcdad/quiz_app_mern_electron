const Question = require('../models/questionSchema');

exports.createQuestion = async (req, res) => {
  try {
    const { mainQuestion, theme, difficulty, answers, correctAnswer } = req.body;

    
    if (!mainQuestion || !theme || !difficulty || !answers || !correctAnswer) {
    return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!Array.isArray(answers) || answers.length < 2) {
    return res.status(400).json({ message: 'Answers must be an array with at least 2 options.' });
    }

    if (!answers.includes(correctAnswer)) {
    return res.status(400).json({ message: 'Correct answer must be one of the provided answers.' });
    }

    const newQuestion = new Question({
      mainQuestion,
      theme,
      difficulty,
      answers,
      correctAnswer,
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question created successfully!', question: newQuestion });
  } catch (err) {
    console.error('Error creating question:', err.message);
    res.status(500).json({ message: 'Server error creating question.' });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const { difficulty, theme } = req.query;

    // Build a dynamic filter object
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (theme) filter.theme = theme;

    const questions = await Question.find(filter);
    res.status(200).json({ questions });
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).json({ message: 'Server error retrieving questions.' });
  }
};

  

