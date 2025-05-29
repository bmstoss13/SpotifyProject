import React from "react";
import "./Song.css";
import { CgPlayButton } from "react-icons/cg";

const Song = ({track, artists, page, pfp}) => {
  return (
    <div className="music-card">
       <div className="music-icon">
        <img src={pfp} alt={track} className="artist-image" />
      </div>
      <div className="song-info">
        <div className="marquee-container">
          <div className="marquee">{track}</div>
        </div>
        <div className="marquee-container">
          <div className="marquee">{artists}</div>
        </div>
      </div>
      <div className="play-icon">
        <CgPlayButton size={125} />
      </div>
    </div>
  );
};

export default Song;
