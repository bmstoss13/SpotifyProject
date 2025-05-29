import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import './LikedSongs.css';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext'; 

export default function LikedSongs() {
  const { getValidAccessToken } = useAuth(); 
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const fetchLikedSongs = async () => {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        setLoading(false);
        return;
      }
      fetch(`/api/liked-songs?access_token=${accessToken}`)
        .then(res => {
          if (!res.ok) throw new Error("Network error");
          return res.json();
        })
        .then(data => {
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
                <span>#{song.title}</span>
                <span>{song.album}</span>
                <span>{song.dateAdded}</span>
                <span>{song.duration}</span>
                <img src ={song.albumArt} alt="" />
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
