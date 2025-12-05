// import Nav from "./components/Nav/Nav"
import { Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './Contexts/NotificationContext/NotificationContext';
import Home from "./pages/Home"
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

function App() {

  return (
    <>
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </NotificationProvider>
      
    </>
  )
}

export default App