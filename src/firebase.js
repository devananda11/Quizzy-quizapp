
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore,doc,setDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkKwdAdVMRalvSxb7ay6mhz3h2tbV9n3U",
  authDomain: "quiz-app-70d81.firebaseapp.com",
  projectId: "quiz-app-70d81",
  storageBucket: "quiz-app-70d81.appspot.com",
  messagingSenderId: "411709738724",
  appId: "1:411709738724:web:e318de22d23940d2bba6f1",
  measurementId: "G-PY6370CDX0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};
