import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, clearQuizStorage } from './utils/storage';
import { UsernameForm } from './components/UsernameForm';
import { TopicSelection } from './components/TopicSelection';
import { LevelSelection } from './components/LevelSelection';
import { Quiz } from './components/Quiz';
import { Results } from './components/Result';

import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState({});

  useEffect(() => {
    if (Object.keys(quizData).length > 0) {
      setStorageItem('quizData', quizData);
    }
  }, [quizData]);

  useEffect(() => {
    const savedData = getStorageItem('quizData') || {};
    const requiredFields = {
      1: [],
      2: ['username'],
      3: ['username', 'selectedTopic'],
      4: ['username', 'selectedTopic', 'selectedLevel', 'questions'],
      5: ['username', 'selectedTopic', 'selectedLevel', 'questions', 'score']
    };

    const isValid = savedData.step && requiredFields[savedData.step]?.every(
      key => key in savedData
    );

    if (isValid) {
      setCurrentStep(savedData.step);
      setQuizData(savedData);
    } else {
      clearQuizStorage();
      setCurrentStep(1);
      setQuizData({});
    }
  }, []);

  const handleRestart = () => {
    clearQuizStorage();
    setCurrentStep(1);
    setQuizData({});
  };

  // Debug log to check values
  console.log("Current Step:", currentStep);
  console.log("Quiz Data:", quizData);

  return (
    <div className="app">
      <header>
        <h1>QuizMaster</h1>
        {quizData.username && currentStep > 1 && (
          <div className="user-info">Welcome, {quizData.username}!</div>
        )}
      </header>

      <main>
        {currentStep === 1 && (
          <UsernameForm 
            initialValue={quizData.username || ''}
            onSuccess={(username) => {
              setQuizData({ step: 2, username });
              setCurrentStep(2);
            }} 
          />
        )}

        {currentStep === 2 && (
          <TopicSelection 
            onSelect={(topic) => {
              setQuizData(prev => ({ ...prev, step: 3, selectedTopic: topic }));
              setCurrentStep(3);
            }}
          />
        )}

        {currentStep === 3 && (
          <LevelSelection 
            topic={quizData.selectedTopic}
            onSelect={(level, questions) => {
              setQuizData(prev => ({ 
                ...prev, 
                step: 4, 
                selectedLevel: level,
                questions 
              }));
              setCurrentStep(4);
            }}
          />
        )}

        {currentStep === 4 && (
          <Quiz
            topic={quizData.selectedTopic}
            difficulty={quizData.selectedLevel}
            questions={quizData.questions}
            onComplete={(score) => {
              setQuizData(prev => ({ ...prev, step: 5, score }));
              setCurrentStep(5);
            }}
          />
        )}

        {currentStep === 5 && quizData.score !== undefined && (
          <Results 
            score={Number(quizData.score)}
            total={quizData.questions ? quizData.questions.length : 0}
            onRestart={handleRestart}
          />
        )}
      </main>

      {currentStep > 1 && currentStep < 5 && (
        <footer>
          <button className="back-btn" onClick={() => {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            setQuizData(prev => ({ ...prev, step: prevStep }));
          }}>
            Back
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;