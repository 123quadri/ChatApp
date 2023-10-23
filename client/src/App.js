import './App.css';
import React from 'react';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <div className='w-screen bg-[#1e2124] h-[100vh] ' >
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/chats' element = {<ChatPage/>} />            
        </Routes>
    </div>
  );
}

export default App;
