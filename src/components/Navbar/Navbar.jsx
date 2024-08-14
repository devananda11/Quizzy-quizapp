import React, { useEffect } from 'react';
import './styles.css';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  
  const navigate=useNavigate()
  const logoutFunc = async () => {
    try {
      await signOut(auth);
      
      navigate('/');
    } catch (error) {
      
    }
  };

  return (
    <div className='navbar'>
      <p className='logo' onClick={() => navigate("/dashboard")}>Quizzy</p>
      {user ? (
        <div className="navbar-link" onClick={logoutFunc}>
          <span style={{ marginLeft: '0.5rem',color:"white",fontSize:"20px" }} >Logout</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Navbar;