import React,{ useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzes } from '../quizzesData';
import './styles.css';
import Navbar from "../Navbar/Navbar"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
function Dashboard() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  return (
    <div className='container'>
      <Navbar/>
      <div className='quizzes'>
      {quizzes.map((quiz) => (
        <button key={quiz.id} onClick={() => navigate(`/quiz/${quiz.id}`)}>
          {quiz.title}
        </button>
      ))}
        
      </div>
      

    </div>
  )
}

export default Dashboard