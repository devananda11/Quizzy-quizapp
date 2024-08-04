import React, { useState, useEffect } from 'react';
import './styles.css';
import { db, auth } from "../../firebase"; 
import { Layout } from 'antd';
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from "../Navbar/Navbar";

function Quiz({ id, quizTitle, questions }) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeTaken, setTimeTaken] = useState(0);
  const [quizRunning, setQuizRunning] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (quizStarted) {
        event.preventDefault();
        event.returnValue = ''; // Standard for most browsers
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quizStarted]);
  
  useEffect(() => {
    let timer;
    if (quizRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setQuizRunning(false);
            handleNextQuestion();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizRunning, currentQuestionIndex]);

  useEffect(() => {
    if (currentQuestionIndex === 0) {
      setQuizRunning(true);
    }
  }, [currentQuestionIndex]);

  const handleAnswerOptionClick = (isCorrect, answer) => {
    setSelectedAnswer(answer);
    const timeSpentOnCurrentQuestion = 30 - timeLeft;
    setTimeTaken(prevTimeTaken => prevTimeTaken + timeSpentOnCurrentQuestion);
  
    setReviewAnswers([...reviewAnswers, { 
      question: questions[currentQuestionIndex].question, 
      selectedAnswer: answer, 
      correctAnswer: questions[currentQuestionIndex].answers.find(a => a.correct)
    }]);
    if (isCorrect) {
      setScore(score + 1);
    }
    setQuizRunning(false);
  };

  const handleNextQuestion = async () => {
    const nextQuestion = currentQuestionIndex + 1;
    const isSkipped = selectedAnswer === null;
  
    // Update review answers
    setReviewAnswers([
      ...reviewAnswers,
      {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: isSkipped ? null : selectedAnswer,
        correctAnswer: questions[currentQuestionIndex].answers.find(a => a.correct),
        skipped: isSkipped
      }
    ]);
  
    // Update time taken for the current question
    const timeSpentOnCurrentQuestion = 30 - timeLeft;
    setTimeTaken(prevTimeTaken => prevTimeTaken + timeSpentOnCurrentQuestion);
  
    if (nextQuestion < questions.length) {
      // Move to the next question
      setCurrentQuestionIndex(nextQuestion);
      setTimeLeft(30);
      setQuizRunning(true);
    } else {
      // End the quiz and show the score
      setShowScore(true);
  
      // Save results to Firebase and navigate to results page
      await saveResultsToFirebase({
        name: user.displayName,
        quizid: id,
        quizTitle: quizTitle,
        score: score,
        timeTaken: timeTaken + (30 - timeLeft),
        time: new Date()
      });
    }
  
    setSelectedAnswer(null);
  };
  
  
  async function saveResultsToFirebase(transaction) {
    try {
      await addDoc(collection(db, 'quizResults'), transaction);
      console.log('Document written with ID: ', transaction.quizid);
      // Redirect to results page after successfully saving to Firebase
      navigate('/results', {  state: { 
        quizId: id, 
        quizTitle: quizTitle, 
        score: score, 
        timeTaken: timeTaken, 
        reviewAnswers: reviewAnswers, 
        questions: questions, 
        totalQuestions: questions.length 
      }  });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  
  return (
  <Layout className="layout">
    <Navbar/>
    <div className="app">
      <div className="quiz-container">
      <h1>{quizTitle}</h1>
      <div className="quiz">
        {showScore ? (
          // Automatically navigate to the results page without showing an intermediate screen
          <div>
            <h2>Processing your results...</h2>
          </div>
        ) : (
          <div>
            <div className="title-and-time">
              <h2>{questions[currentQuestionIndex].question}</h2>
              <div className="timer">{timeLeft}s</div>
            </div>

            <div id="answer-buttons">
              {questions[currentQuestionIndex].answers.map((answer, index) => (
                <button
                  key={index}
                  className={`btn ${selectedAnswer !== null && (answer.correct ? 'correct' : 'incorrect')}`}
                  onClick={() => handleAnswerOptionClick(answer.correct, answer)}
                  disabled={selectedAnswer !== null}
                >
                  {answer.text}
                </button>
              ))}
            </div>
            {selectedAnswer !== null && (
              <button id="next-btn" onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Show Score'}
              </button>
            )}
          </div>
        )}
      </div>
      </div>
      
    </div>
  </Layout>
);

}

export default Quiz;
