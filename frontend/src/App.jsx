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

    const isValid = requiredFields[savedData.step]?.every(
      key => key in savedData
    );

    // if (!isValid) {
      clearQuizStorage();
      setCurrentStep(1);
      setQuizData({});
    // } else {
    //   setCurrentStep(savedData.step);
    //   setQuizData(savedData);
    // }
  }, []);

  const handleRestart = () => {
    clearQuizStorage();
    setCurrentStep(1);
    setQuizData({});
  };

  return (
    <div className="app">
      <header>
        <h1>QuizMaster</h1>
      </header>

      <main>
        {currentStep === 1 && (
          <UsernameForm onSuccess={(username) => {
            setQuizData({ step: 2, username });
            setCurrentStep(2);
          }} />
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
          onComplete={(score) => {
            setQuizData(prev => ({ ...prev, step: 5, score }));
            setCurrentStep(5);
          }}
        />
      )}

        {currentStep === 5 && (
          <Results 
            score={quizData.score} 
            total={quizData.questions?.length} 
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default App;