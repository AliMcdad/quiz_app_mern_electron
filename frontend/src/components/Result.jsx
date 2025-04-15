export const Results = ({ score, total, onRestart }) => {
  console.log("📊 Results received:", { score, total });
  const safeScore = typeof score === 'number' ? score : 0;
  const safeTotal = typeof total === 'number' && total > 0 ? total : 1;
  const percentage = ((safeScore / safeTotal) * 100).toFixed(1);
    
  
    return (
      <div className="results-container">
        <h2>Quiz Results</h2>
        
        <div className="score-display">
          <div className="score-circle">
            <div className="circle-background">
              <div 
                className="circle-progress"
                style={{ transform: `rotate(${(percentage / 100) * 180}deg)` }}
              ></div>
            </div>
            <div className="score-content">
              <span className="score-percent">{percentage}%</span>
              <span className="score-text">{score}/{total} Correct</span>
            </div>
          </div>
        </div>
  
        <div className="results-actions">
          <button className="restart-btn" onClick={onRestart}>
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  };