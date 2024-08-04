import React,{useState} from 'react';
import './styles.css'; 
import { GoogleOutlined } from '@ant-design/icons';
import { getAuth, signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import {auth,db} from "../../firebase"
import { useNavigate } from 'react-router-dom';
import {doc,getDoc,setDoc} from "firebase/firestore"

function CenteredCard() {
  
    const [loading,setLoading]=useState(false)
    const navigate= useNavigate();
    
    async function createDoc(user) {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);
      console.log("userData.exists()", userData.exists());
      if (!userData.exists()) {
        try {
          await setDoc(userRef, {
            name: user.displayName || "Anonymous",
            email: user.email,
            photoURL: user.photoURL || "",
            createdAt: new Date()
          });
          console.log("User document created successfully!");
        } catch (e) {
          console.error("Error creating doc:", e);
        }
      }
    }
    function googleAuth(){
    setLoading(true)
    const provider=new GoogleAuthProvider()
    
    
    
   
    signInWithPopup(auth, provider)
    .then((result) => {
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    const user = result.user;
    console.log(user);
    console.log(user.displayName)
    setLoading(false)
    createDoc(user)
    navigate("/dashboard")

  }).catch((error) => {
    
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    setLoading(false)
  });
    }
    return (
        <div id="login-page">
          <div id="login-card">
            <h2 className='intro'>Welcome to <span>Quizzy</span>!</h2>
            <div className='login-button google' onClick={googleAuth}>
              <GoogleOutlined /> Sign In with Google
            </div>
          </div>
        </div>
      );
}

export default CenteredCard;
