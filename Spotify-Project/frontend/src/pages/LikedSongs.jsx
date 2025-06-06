import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import './LikedSongs.css';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext'; 

export default function LikedSongs() {
  const { getValidAccessToken } = useAuth(); 
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("You");
  const [sortDesc, setSortDesc] = useState(true);

  const handleSortByDate = () => {
    setSortDesc(prev => !prev);
    setSongs(prevSongs => 
      [...prevSongs].sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return sortDesc ? dateB - dateA : dateA - dateB;
      })
    );
  };

  useEffect( () => {
    const fetchLikedSongs = async () => {
      const accessToken = await getValidAccessToken();
      console.log(accessToken);
      if (!accessToken) {
        setLoading(false);
        return;
      }
       // fetch username
      fetch(`https://api.spotify.com/v1/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(profile => {
        setUsername(profile.display_name || "User");
      })
      .catch(() => setUsername("User"))
      
      // fetch liked songs
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
    return <p> Loading... </p>

  }


  return (
    <div className="liked-songs-wrapper">
      <main className="liked-songs-main">
        <section className="liked-songs-header">
        <div className="cover-icon">
            <FaHeart className="heart-icon" />
            </div>
          <div className="header-text">
            <p className="playlist-label">Playlist</p>
            <h1 className="liked-songs-title">Liked Songs</h1>
            <p className="subtitle">{username} • {songs.length} songs</p>
          </div>
        </section>

        <section className="song-table-container">
          <div className="table-header">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={handleSortByDate}
              >
                Date added {sortDesc ? "▲" : "▼"}
              </span>
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
                     <span style={{ fontWeight: 500 }}>
                        <a
                          href={song.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{textDecoration: "underline"}}
                        >
                          {song.title}
                        </a>
                      </span>
                  </span>
                  <span>{song.album}</span>
                  <span>{song.dateAdded}</span>
                  <span>{song.duration}</span>
                </div>
              ))
          )}
        </section>
      </main>
    </div>
    
  );
}

function msToMinSec(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
