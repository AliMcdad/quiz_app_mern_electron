export const fetchQuestions = async (theme, difficulty, page = 1) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/questions/getAllQuestions?theme=${theme}&difficulty=${difficulty}&page=${page}&limit=1`
    );
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const submitQuizResults = async (results) => {
  try {
    const response = await fetch('http://localhost:3000/api/questions/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    });
    return await response.json();
  } catch (error) {
    console.error('Submission Error:', error);
    throw error;
  }
};