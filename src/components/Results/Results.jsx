import React, { useState, useEffect } from 'react';
import './styles.css';
import { Bar } from '@ant-design/charts';
import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import { query,collection,where,orderBy,getDocs } from 'firebase/firestore';
import { db} from "../../firebase"; 

function Results() {
  const location = useLocation();
  const { quizId, quizTitle, score, timeTaken, reviewAnswers, questions = [], totalQuestions } = location.state || {};

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showReviewAnswers, setShowReviewAnswers] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  console.log(reviewAnswers)
  useEffect(() => {
    if (quizId) {
      fetchLeaderboardData();
    }
  }, [quizId]);

  const fetchLeaderboardData = async () => {
    if (!quizId) return;

    try {
      const q = query(
        collection(db, 'quizResults'),
        where("quizid", "==", quizId),
        orderBy("score", "desc")
      );
      const querySnapshot = await getDocs(q);
      const allData = querySnapshot.docs.map(doc => ({
        quizid: doc.data().quizid,
        score: doc.data().score,
        name: doc.data().name,
        time: doc.data().time
      }));
      const uniqueDataMap = new Map();
      allData.forEach(entry => {
        if (!uniqueDataMap.has(entry.name)) {
          uniqueDataMap.set(entry.name, entry);
        }
      });
      const uniqueData = Array.from(uniqueDataMap.values());
      setLeaderboardData(uniqueData);
    } catch (error) {
      console.error("Error fetching leaderboard data: ", error);
    }
  };

  const handleReviewButton = () => {
    setShowReviewAnswers(true);
    setShowLeaderboard(false);
  };

  const handleViewLeaderboard = () => {
    setShowReviewAnswers(false);
    setShowLeaderboard(true);
  };

  const leaderboardConfig = {
    data: leaderboardData,
    xField: 'name',
    yField: 'score',
    seriesField: 'name',
    colorField: 'name',
    xAxis: { title: { text: 'Name' } },
    yAxis: { title: { text: 'Score' } },
  };

  return (
    <div className="results">
      <Navbar/>
      <div className="results-summary">
        <h1>Quiz Results</h1>
        <p>Quiz Title: {quizTitle}</p>
        <p>Your Score: {score}/{totalQuestions}</p>
        <p>Time Taken: {timeTaken}s</p>
      </div>
      <div className="review-leaderboard-buttons">
        <button className="review-button" onClick={handleReviewButton}>Review Answers</button>
        <button className="leaderboard-button" onClick={handleViewLeaderboard}>Show Leaderboard</button>
      </div>
      <div className="review-leaderboard-container">
        {showReviewAnswers && (
          <div className="review-answers">
            {questions.map((question, index) => {
              const review = reviewAnswers.find(answer => answer.question === question.question);
              const correctAnswer = question.answers.find(answer => answer.correct);
              let answerClass = '';
              let yourAnswerText = '';
              let correctAnswerText = '';

              if (review) {
                if (review.skipped) {
                  answerClass = 'skipped';
                  yourAnswerText = 'You skipped this question';
                  correctAnswerText = correctAnswer.text;
                } else if (review.selectedAnswer && review.selectedAnswer.correct) {
                  answerClass = 'correct';
                  yourAnswerText = review.selectedAnswer.text;
                  correctAnswerText = '';
                } else {
                  answerClass = 'incorrect';
                  yourAnswerText = review.selectedAnswer ? review.selectedAnswer.text : '';
                  correctAnswerText = correctAnswer.text;
                }
              }

              return (
                <div key={index} className={`review-answer ${answerClass}`}>
                  <h3>{question.question}</h3>
                  <p>Your Answer: {yourAnswerText}</p>
                  {correctAnswerText && <p>Correct Answer: {correctAnswerText}</p>}
                </div>
              );
            })}
          </div>
        )}
        {showLeaderboard && (
          <div className="leaderboard">
            <Bar {...leaderboardConfig} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
