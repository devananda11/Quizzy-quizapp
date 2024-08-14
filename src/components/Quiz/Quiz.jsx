import React, { useState, useEffect } from 'react';
import './styles.css';
import { db, auth } from "../../firebase"; 
import { Layout } from 'antd';
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
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
  const [reviewAnswers, setReviewAnswers] = useState([]);
  const [quizRunning, setQuizRunning] = useState(false);

  

  useEffect(() => {
    const checkIfQuizAttempted = async () => {
      const resultsQuery = query(
        collection(db, 'quizResults'),
        where('quizid', '==', id),
        where('name', '==', user.displayName)
      );
      const querySnapshot = await getDocs(resultsQuery);
      if (!querySnapshot.empty) {
        const resultData = querySnapshot.docs[0].data();
        navigate('/results', { state: { 
          quizId: id, 
          quizTitle: resultData.quizTitle, 
          score: resultData.score, 
          timeTaken: resultData.timeTaken, 
          reviewAnswers: resultData.reviewAnswers, 
          questions: questions, 
          totalQuestions: questions.length 
        } });
      }
    };

    checkIfQuizAttempted();
  }, [id, navigate, user.displayName, questions]);

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
      correctAnswer: questions[currentQuestionIndex].answers.find(a => a.correct),
      skipped: false
    }]);
    if (isCorrect) {
      setScore(score + 1);
    }
    setQuizRunning(false);
  };

  const handleNextQuestion = async () => {
    const nextQuestion = currentQuestionIndex + 1;
    const isSkipped = selectedAnswer === null;
  
    if (isSkipped) {
      setReviewAnswers([
        ...reviewAnswers,
        {
          question: questions[currentQuestionIndex].question,
          selectedAnswer: null,
          correctAnswer: questions[currentQuestionIndex].answers.find(a => a.correct),
          skipped: true
        }
      ]);
    } else {
      setReviewAnswers([
        ...reviewAnswers,
        reviewAnswers[reviewAnswers.length - 1] // Ensure the last question is added properly
      ]);
    }
  
    const timeSpentOnCurrentQuestion = 30 - timeLeft;
    setTimeTaken(prevTimeTaken => prevTimeTaken + timeSpentOnCurrentQuestion);
  
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setTimeLeft(30);
      setQuizRunning(true);
    } else {
      setShowScore(true);
      await saveResultsToFirebase({
        name: user.displayName,
        quizid: id,
        quizTitle: quizTitle,
        score: score,
        timeTaken: timeTaken + (30 - timeLeft),
        reviewAnswers: [...reviewAnswers, { // Ensure last question is added
          question: questions[currentQuestionIndex].question,
          selectedAnswer: isSkipped ? null : selectedAnswer,
          correctAnswer: questions[currentQuestionIndex].answers.find(a => a.correct),
          skipped: isSkipped
        }],
        time: new Date()
      });
    }
  
    setSelectedAnswer(null);
  };
  

  async function saveResultsToFirebase(transaction) {
    try {
      await addDoc(collection(db, 'quizResults'), transaction);
      console.log('Document written with ID: ', transaction.quizid);
      navigate('/results', { state: { 
        quizId: id, 
        quizTitle: quizTitle, 
        score: score, 
        timeTaken: timeTaken, 
        reviewAnswers: reviewAnswers, 
        questions: questions, 
        totalQuestions: questions.length 
      } });
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
