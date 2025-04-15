export const getStorageItem = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.error('LocalStorage read error:', error);
      return null;
    }
  };
  
  export const setStorageItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage write error:', error);
    }
  };
  
  export const clearQuizStorage = () => {
    localStorage.removeItem('quizData');
    localStorage.removeItem('quizmaster_username');
    localStorage.removeItem('quizProgress');
    localStorage.removeItem('quizAnswers');
    localStorage.removeItem('quizResults');
  };