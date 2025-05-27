import React from "react";
import "./Song.css";
import { CgPlayButton } from "react-icons/cg";

const Song = ({ title = "Song X sdfasdfasfdasdfasdfasfasfasdfasdfasfd", artist = "Artist Y", pfp}) => {
  return (
    <div className="music-card">
      <div className="music-icon">🎵</div>
      <div className="song-info">
        <div className="marquee-container">
          <div className="marquee">{title}</div>
        </div>
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

export default Song;
