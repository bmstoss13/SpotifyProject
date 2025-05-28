import React from 'react';
import axios from "axios";
import Sidebar from '../components/Sidebar';
import './LikedSongs.css';
import { FaHeart } from 'react-icons/fa';


const mockSongs = [
  { title: "Blinding Lights", album: "After Hours", dateAdded: "April 21, 2025", duration: "4:46" },
  { title: "In Your Eyes", album: "After Hours", dateAdded: "April 21, 2025", duration: "3:45" },
  { title: "Save Your Tears", album: "After Hours", dateAdded: "April 21, 2025", duration: "3:23" },
  { title: "After Hours", album: "After Hours", dateAdded: "April 21, 2025", duration: "4:32" },
  { title: "Until I Bleed Out", album: "After Hours", dateAdded: "April 21, 2025", duration: "9:22" },
  { title: "Alone Again", album: "After Hours", dateAdded: "April 21, 2025", duration: "0:34" },
  { title: "Too Late", album: "After Hours", dateAdded: "April 21, 2025", duration: "10:23" },
];

export default function LikedSongs() {
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
            <p className="subtitle">saksham ● 30 songs</p>
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

          {mockSongs.map((song, i) => (
            <div key={i} className="song-row">
              <span>#{i + 1}</span>
              <span>{song.title}</span>
              <span>{song.album}</span>
              <span>{song.dateAdded}</span>
              <span>{song.duration}</span>
            </div>
          ))}
        </section>
        </div>
      </main>
    </div>
    
  );
}
