import React from "react";
import Artist from "../components/Artist";
import SquareContainer from "../components/SquareContainer";
const TopArtists = () => {
  const artists = [
    { artist: "Drake", pfp: "https://example.com/drake.jpg" },
    { artist: "Taylor Swift", pfp: "https://example.com/taylor.jpg" },
    { artist: "The Weeknd", pfp: "https://example.com/weeknd.jpg" },
    { artist: "Ed Sheeran", pfp: "https://example.com/ed.jpg" },
    { artist: "Billie Eilish", pfp: "https://example.com/billie.jpg" },
  ];
  return (
    <div>
      <SquareContainer type={"artists"} top={artists} />
    </div>
  );
};

export default TopArtists;
