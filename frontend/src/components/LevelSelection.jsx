import { useState } from 'react';
import { fetchQuestions } from '../services/api';

const levels = [
  { id: 'beginner', name: 'Beginner', description: 'Basic questions for beginners' },
  { id: 'intermediate', name: 'Intermediate', description: 'Moderate level challenge' },
  { id: 'expert', name: 'Expert', description: 'Advanced questions for experts' }
];

export const LevelSelection = ({ topic, onSelect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLevelSelect = async (level) => {
    if (!topic) {
      setError('Please select a topic first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetchQuestions(topic, level);
      
      if (response?.questions?.length) {
        onSelect(level, response.questions);
      } else {
        setError('No questions found for this combination');
      }
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selection-container">
      <h2>Select Difficulty Level</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="level-grid">
        {levels.map(level => (
          <div
            key={level.id}
            className={`level-card ${level.id} ${loading ? 'disabled' : ''}`}
            onClick={() => !loading && handleLevelSelect(level.id)}
          >
            <h3>{level.name}</h3>
            <p>{level.description}</p>
            {loading && <div className="loader">Loading...</div>}
          </div>
        ))}
      </div>
    </div>
  );
};