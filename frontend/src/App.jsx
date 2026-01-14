import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Tasks from "./Tasks"
import Login from './pages/Login';

function ProtectedRoute ({children}){
  const token = localStorage.getItem('token');

  if(!token){
    return <Navigate to = "/login" replace />
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <h1>📝 React Task Evaluator</h1>

        <Routes>
          <Route path='/login' element={<Login />} />

          <Route
            path='/tasks'
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

            <Route path='/' element={<Navigate to='/login' replace />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
