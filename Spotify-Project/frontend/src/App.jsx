import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Chat from './pages/Chat';
import Inbox from './pages/Inbox';
import LikedSongs from './pages/LikedSongs';
import TopArtists from './pages/TopArtists';
import TopSongs from './pages/TopSongs';
import Discover from './pages/Discover';
import Forums from './pages/Forums';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/';

  // const [accessToken, setAccessToken] = useState(null);
  // const [refreshToken, setRefreshToken] = useState(null);
  // const [expiresIn, setExpiresIn] = useState(null);

  //  useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);

  //   const auth = urlParams.get("access_token");
  //   const refresh = urlParams.get("refresh_token");
  //   const expires = urlParams.get("expires_in");

  //   if (auth) {
  //     setAccessToken(auth);
  //     setRefreshToken(refresh);
  //     setExpiresIn(expires);
  //   }

  //   // Optionally, remove the parameters from the URL
  //   window.history.replaceState({}, document.title, window.location.pathname);
  // }, []);

  // function handleSignOut() {
  //   setAccessToken(null);
  //   setRefreshToken(null);
  //   setExpiresIn(null);
  // }

  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />}
      <main style={{ flexGrow: 1, padding: '2rem', marginLeft: hideSidebar ? '0' : '280px' }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/liked-songs" element={<ProtectedRoute><LikedSongs /></ProtectedRoute>} />
          <Route path="/top-artists" element={<ProtectedRoute><TopArtists /></ProtectedRoute>} />
          <Route path="/top-songs" element={<ProtectedRoute><TopSongs /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/forums" element={<ProtectedRoute><Forums /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;