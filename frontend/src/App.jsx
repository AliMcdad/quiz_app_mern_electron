import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState('');
  const topics = [
    { _id: '1', name: 'History', description: 'Test your knowledge of historical events', icon: '📚' },
    { _id: '2', name: 'Science', description: 'Explore scientific concepts and discoveries', icon: '🔬' },
    { _id: '3', name: 'Geography', description: 'Learn about countries and landmarks', icon: '🌎' },
    { _id: '4', name: 'Movies', description: 'Test your cinema knowledge', icon: '🎬' },
    { _id: '5', name: 'Music', description: 'Questions about artists and songs', icon: '🎵' },
    { _id: '6', name: 'Technology', description: 'Explore the world of tech', icon: '💻' }
  ];

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    localStorage.setItem('quizmaster_username', username);
    
    setError('');
    setStep(2);
  };

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setStep(3);
  };

  const handleLevelSelect = async (level) => {
    try{
      const response = await fetch(`http://localhost:5000/api/quiz/getAllQuestions?theme=${selectedTopic}&difficulty=${level}`);
      const data = await response.json();
      
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setLoading(false);
        setStep(4);
      } else {
        setError("No questions found for this topic and difficulty level.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
      setError("Failed to load questions. Please try again.");
    }
  };
    
  const levels = [
    { id: 'beginner', name: 'Beginner', description: 'Basic questions for beginners' },
    { id: 'intermediate', name: 'Intermediate', description: 'Moderate level challenge' },
    { id: 'expert', name: 'Expert', description: 'Advanced questions for experts' }
  ];

  return (
    <div className="app">
      <header>
        <h1>QuizMaster</h1>
      </header>
      
      <main>
            {step === 1 && (
              <div className="username-container">
                <h2>Welcome to QuizMaster!</h2>
                <p className="welcome-text">Test your knowledge across various topics and challenge yourself with different difficulty levels.</p>
                
                <div className="username-card">
                  <h3>Enter Your Username</h3>
                  <form onSubmit={handleUsernameSubmit}>
                    <div className="input-group">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setError('');
                        }}
                        placeholder="Your username"
                        maxLength={20}
                        className={error ? 'error' : ''}
                      />
                      {error && <p className="error-message">{error}</p>}
                    </div>
                    <button type="submit" className="start-btn">
                      Start Quiz
                    </button>
                  </form>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="selection-container">
                <h2>Select a Topic</h2>
                <div className="topic-grid">
                  {topics.map(topic => (
                    <div
                      key={topic._id}
                      className="topic-card"
                      onClick={() => handleTopicSelect(topic._id)}
                    >
                      <div className="topic-icon">{topic.icon}</div>
                      <h3>{topic.name}</h3>
                      <p>{topic.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="selection-container">
                <h2>Select Difficulty Level</h2>
                <div className="level-grid">
                  {levels.map(level => (
                    <div
                      key={level.id}
                      className={`level-card ${level.id}`}
                    >
                      <h3>{level.name}</h3>
                      <p>{level.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="quiz-container">
                <h2>Quiz Time!</h2>
                <div className="questions">
                  
                </div>
                
                <button 
                  className="submit-btn"
                >
                  Submit Answers
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="results-container">
                <h2>Quiz Results</h2>
                
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-number">{score}</span>
                    <span className="score-total">/{questions.length}</span>
                  </div>
                </div>
                
                <button className="restart-btn" onClick={handleRestart}>
                  Take Another Quiz
                </button>
              </div>
            )}
      </main>
    </div>
  );
}

export default App;