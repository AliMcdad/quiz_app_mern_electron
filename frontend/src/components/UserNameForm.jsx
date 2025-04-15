import { useState } from 'react';

export const UsernameForm = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    onSuccess(username);
  };

  return (
    <div className="username-container">
      <h2>Welcome to QuizMaster!</h2>
      <form onSubmit={handleSubmit}>
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
  );
};