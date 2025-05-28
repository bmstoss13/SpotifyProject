import React from "react";
import "./Artist.css";
import { CgPlayButton } from "react-icons/cg";
const Artist = ({ artist, pfp }) => {
  return (
    <div className="music-card">
      <div className="music-icon">
        <img src={pfp} alt={artist} className="artist-image" />
      </div>
      <div className="song-info">
        <div className="marquee-container">
          <div className="marquee">{artist}</div>
        </div>
      </div>
      <div className="play-icon">
        <CgPlayButton size={125} />
      </div>
    </div>
  );
};

export default Artist;
