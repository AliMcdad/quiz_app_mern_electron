import { useState, useEffect } from 'react';
import { fetchQuestions, submitQuizResults } from '../services/api';
import { getStorageItem, setStorageItem } from '../utils/storage';

export const Quiz = ({ topic, difficulty, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [progress, setProgress] = useState({ 
    page: 1, 
    totalPages: 1,
    totalQuestions: 0
  });
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedProgress = getStorageItem('quizProgress');
    if (savedProgress) {
      setProgress(savedProgress);
      setScore(savedProgress.score || 0);
      loadQuestion(savedProgress.page);
    } else {
      loadQuestion(1);
    }
  }, []);
  

  const loadQuestion = async (page) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchQuestions(topic, difficulty, page);
      console.log("📥 fetchQuestions response:", response);

      if (response.success && response.questions.length > 0) {
        setCurrentQuestion(response.questions[0]);
        setProgress(prev => ({
          ...prev,
          page: response.page,
          totalPages: response.totalPages,
          totalQuestions: response.totalQuestions
        }));
        setStorageItem('quizProgress', {
          topic,
          difficulty,
          page: response.page,
          score,
          totalPages: response.totalPages,
          totalQuestions: response.totalQuestions
        });
      } else {
        setError('No questions found');
      }
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setError('');
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      setError('Please select an answer before proceeding');
      return;
    }
  
    // Calculate new score first
    const newScore = selectedAnswer === currentQuestion.correctAnswer 
      ? score + 1 
      : score;
  
    setScore(newScore);
    setStorageItem('quizProgress', { ...progress, score: newScore });
  
    if (progress.page < progress.totalPages) {
      await loadQuestion(progress.page + 1);
      setSelectedAnswer('');
    } else {
      handleSubmit();
    }
  };

 /*  const handleSubmit = async () => {
    try {
      await submitQuizResults({
        score,
        total:progress.totalQuestions,
        topic,
        difficulty
      });
      console.log("🚨 Submitting to Results:", { score, total: progress.totalQuestions });

      localStorage.removeItem('quizProgress');
      // Simply pass the score (number) to match what App.jsx expects
      onComplete({
        score, 
        total: progress.totalQuestions
      });
    } catch (err) {
      setError('Failed to submit results. Please try again.');
    }
  }; */

  const handleSubmit = async () => {
    try {
      // Make absolutely sure both values are numbers
      const finalScore = Number(score);
      const finalTotal = Number(progress.totalQuestions);
  
      // Submit results to backend
      await submitQuizResults({
        score: finalScore,
        total: finalTotal,
        topic,
        difficulty
      });
  
      console.log("🚨 Submitting to Results:", { finalScore, finalTotal });
  
      // Clear saved progress
      localStorage.removeItem('quizProgress');
  
      // Notify parent (App.jsx) and move to Results step
      onComplete({
        score: finalScore,
        total: finalTotal
      });
    } catch (err) {
      console.error("❌ Error submitting results:", err);
      setError('Failed to submit results. Please try again.');
    }
  };
  
  if (loading) return <div className="loader">Loading question...</div>;

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((progress.page) / progress.totalPages) * 100}%` }}
        ></div>
        <span className="progress-text">
          Question {progress.page} of {progress.totalPages}
        </span>
      </div>

      {currentQuestion && (
        <div className="question-card">
          <h3 className="question-text">{currentQuestion.mainQuestion}</h3>
          <div className="answers-grid">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                className={`answer-btn ${selectedAnswer === answer ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="quiz-controls">
        <button 
          className="next-btn"
          onClick={progress.page < progress.totalPages ? handleNext : handleSubmit}
          disabled={!selectedAnswer || loading}
        >
          {progress.page < progress.totalPages ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};