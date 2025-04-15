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
      const { difficulty, theme, page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      const filter = {};
      
      if (difficulty) {
        filter.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
      }
      
      if (theme) {
        filter.theme = { $regex: new RegExp(`^${theme}$`, 'i') };
      }
  
      const total = await Question.countDocuments(filter);
      const questions = await Question.find(filter)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      res.status(200).json({
        success: true,
        questions,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalQuestions: total
      });
    } catch (err) {
      console.error('Error fetching questions:', err.message);
      res.status(500).json({ 
        success: false,
        message: 'Server error retrieving questions.' 
      });
    }
  };

exports.submitQuizResults = async (req, res) => {
  try {
    const { score, total, topic, difficulty } = req.body;
    
    if (typeof score !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ success: false, message: 'Invalid results format' });
    }

    res.status(200).json({
      success: true,
      score,
      total,
      percentage: ((score / total) * 100).toFixed(2)
    });
  } catch (err) {
    console.error('Error submitting results:', err.message);
    res.status(500).json({ success: false, message: 'Server error submitting results' });
  }
};
