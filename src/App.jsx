
import './App.css'
import Login from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"

import QuizPage from './components/QuizPage'
import Results from './components/Results/Results'
function App() {
    return(<>
    <Router>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/quiz/:id" element={<QuizPage/>}/>
            <Route path="/results" element={<Results/>}/>
        </Routes>
    </Router>
    
    </>
        
    )
  
}

export default App
