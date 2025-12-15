// import Nav from "./components/Nav/Nav"
import { Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './Contexts/NotificationContext/NotificationContext';
import Home from "./pages/Home/Home"
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AddProduct from './pages/AddProduct/AddProduct';
import Tiles from './pages/Tile/Tile';

function App() {

  return (
    <>
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/tiles" element={<Tiles />} />

      </Routes>
    </NotificationProvider>
      
    </>
  )
}

export default App