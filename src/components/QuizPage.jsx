
import React from 'react';
import { useParams } from 'react-router-dom';
import { quizzes } from './quizzesData';
import Quiz from '../components/Quiz/Quiz'; 

const QuizPage = () => {
  const { id } = useParams();
  const quiz = quizzes.find((quiz) => quiz.id === id);

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return <Quiz id={quiz.id} quizTitle={quiz.title} questions={quiz.questions} />;
};

export default QuizPage;
