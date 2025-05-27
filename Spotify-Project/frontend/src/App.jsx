import { useState } from 'react'
import Chat from './pages/Chat'
import Inbox from './pages/Inbox'
import LikedSongs from './pages/LikedSongs'
import TopArtists from './pages/TopArtists'
import TopSongs from './pages/TopSongs'
import Discover from './pages/Discover'
import Forums from './pages/Forums'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '2rem', marginLeft: '280px' }}>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/liked-songs" element={<LikedSongs />} />
          <Route path="/top-artists" element={<TopArtists />} />
          <Route path="/top-songs" element={<TopSongs />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/forums" element={<Forums />} />
        </Routes>
      </main>
    </div>
  )
};

export default App;
