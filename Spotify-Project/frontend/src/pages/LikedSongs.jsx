import React, { useEffect, useState } from 'react';
import { fetchLikedSongs } from '../services/api';
import '../services/LikedSongs.css';

export default function LikedSongs() {
    const [songs, setSongs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
    if (!token) return;

    fetchLikedSongs(token)
      .then(setSongs)
      .catch((err) => console.error('Fetch failed:', err));
  }, []);

  return (
    <div className="liked-songs-page">
      <h1>Liked Songs</h1>
      <table className="songs-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Album</th>
            <th>Date Added</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{song.title}</td>
              <td>{song.album}</td>
              <td>{song.dateAdded}</td>
              <td>{song.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}