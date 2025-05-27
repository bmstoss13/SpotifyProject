import { useState } from 'react'
import Chat from './pages/Chat'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'

function App() {

  return(
    <>
    <Routes>
      <Route path="/" element={<Profile />}/>
    </Routes>
    </>
  )
};

export default App;
