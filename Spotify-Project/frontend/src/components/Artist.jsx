import React from "react";
import "./Artist.css"
import { CgPlayButton } from "react-icons/cg";
const Artist = ({ artist, pfp, page }) => {
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
      <a
        href={page}
        target="_blank"
        rel="noopener noreferrer"
        className="play-icon transparent-button"
      >
        <CgPlayButton size={100} />
      </a>
    </div>
  );
};

export default Artist;
