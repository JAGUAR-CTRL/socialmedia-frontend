import { useState } from 'react';
import Chat from './Chat/Chat.jsx';
import Login from './Login/Login.jsx';
import Signup from './Signup/Signup.jsx';
import ChatRoom from './ChatRoom/ChatRoom.jsx';
import {BrowserRouter, Routes, Route , Navigate} from "react-router-dom"
import './App.css';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DefaultLoad/>}/>
        <Route path='/login' exact element={<Login/>}/>
        <Route path='/signup' exact element={<Signup/>}/>
        <Route path="/chat" exact element={<Chat/>}/>
        <Route path='/chat/:id' exact element={<ChatRoom/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export function DefaultLoad(){
  let isToken = localStorage.getItem("token") != null  || localStorage.getItem("token") != undefined;
  return ( isToken ? <Navigate to="/chat"/>: <Navigate to="/login"/> )

}

export default App
