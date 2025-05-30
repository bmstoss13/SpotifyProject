import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import './LikedSongs.css';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext'; 

export default function LikedSongs() {
  const { getValidAccessToken } = useAuth(); 
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const fetchLikedSongs = async () => {
      const accessToken = await getValidAccessToken();
      console.log(accessToken);
      if (!accessToken) {
        setLoading(false);
        return;
      }
      fetch(`https://test-spotify-site.local:3000/api/liked-songs?access_token=${accessToken}`)
        .then(res => {
          console.log(res.body);
          if (!res.ok) throw new Error("Network error");
          return res.json();
        })
        .then(data => {
          console.log(data);
          setSongs(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load liked songs:", err);
          setSongs([]);
          setLoading(false);
        });
    };
    fetchLikedSongs();
  }, [getValidAccessToken]);
  
  if (loading) { 
    return (<p>
      loading
    </p>)
  }

  return (
    <div className="liked-songs-wrapper">
      <Sidebar />
      <main className="liked-songs-main">
      <div className="liked-songs-content">
        <section className="liked-songs-header">
        <div className="cover-icon">
            <FaHeart className="heart-icon" />
            </div>
          <div className="header-text">
            <p className="playlist-label">Playlist</p>
            <h1 className="liked-songs-title">Liked Songs</h1>
            <p className="subtitle">You • {songs.length} songs</p>
          </div>
        </section>

        <section className="song-table-container">
          <div className="table-header">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date added</span>
            <span>🕒</span>
          </div>
          {(!songs || songs.length === 0) ? (
              <div style={{padding: "2rem", textAlign: "center"}}>Loading...</div>
            ) : (
              songs.map((song, i) => (
                <div key={i} className="song-row">
                  <span>{i + 1}</span>
                  <span className="title-cell" style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={song.albumArt}
                      alt=""
                      className="album-art"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 4,
                        objectFit: "cover",
                        marginRight: 12,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>{song.title}</span>
                  </span>
                  <span>{song.album}</span>
                  <span>{song.dateAdded}</span>
                  <span>{song.duration}</span>
                </div>
              ))
          )}
        </section>
        </div>
      </main>
    </div>
    
  );
}

function msToMinSec(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
