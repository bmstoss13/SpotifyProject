import React from "react";
import "./Song.css";
import { CgPlayButton } from "react-icons/cg";
const Artist = ({artist, pfp}) => {
  return (
    <div className="music-card">
      <div className="music-icon">🎵</div>
      <div className="song-info">
        <div className="marquee-container">
          <div className="marquee">{"Drake"}</div>
        </div>
      </div>
      <div className="play-icon">
        <CgPlayButton size={125} />
      </div>
    </div>
  );
};

export default Artist;
