import React from "react";
import Song from "./Song";
import "./SquareContainer.css";

// Sample song data (replace or expand this as needed)
const songs = Array.from({ length: 20 }).map((_, i) => ({
  title: `Song ${i + 1}`,
  artist: `Artist ${i + 1}`,
}));

const SquareContainer = () => {
  return (
    <div className="grid-container">
      {songs.map((song, index) => (
        <Song
          key={index}
          title={song.title}
          artist={song.artist}
        />
      ))}
    </div>
  );
};

export default SquareContainer;
