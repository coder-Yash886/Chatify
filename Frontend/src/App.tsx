import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import VerifyOTP from './pages/verifyOTP';
import Login from './pages/Login';
import RoomsList from './pages/RoomsList';
import ChatRoom from './pages/ChatRoom';

export default function App() {
  const token = localStorage.getItem('token') || '';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/chat/:roomId" element={<ChatRoom token={token} />} />
      </Routes>
    </Router>
  );
}