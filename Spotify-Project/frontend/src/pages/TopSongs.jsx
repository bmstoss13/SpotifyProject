import {React, useState} from "react";
import SquareContainer from "../components/SquareContainer";
import "./Top.css";
import TimeFilter from "../components/TimeFilter";
const TopSongs = () => {
  const [time, changeTime] = useState("All-Time");
  const songs = [
    { title: "Song 1", artist: "Artist A" },
    { title: "Song 2", artist: "Artist B" },
    { title: "Song 3", artist: "Artist C" },
    { title: "Song 4", artist: "Artist D" },
    { title: "Song 5", artist: "Artist E" },
    { title: "Song 1", artist: "Artist A" },
    { title: "Song 2", artist: "Artist B" },
    { title: "Song 3", artist: "Artist C" },
    { title: "Song 4", artist: "Artist D" },
    { title: "Song 5", artist: "Artist E" },
    { title: "Song 1", artist: "Artist A" },
    { title: "Song 2", artist: "Artist B" },
    { title: "Song 3", artist: "Artist C" },
    { title: "Song 4", artist: "Artist D" },
    { title: "Song 5", artist: "Artist E" },
    { title: "Song 1", artist: "Artist A" },
    { title: "Song 2", artist: "Artist B" },
    { title: "Song 3", artist: "Artist C" },
    { title: "Song 4", artist: "Artist D" },
    { title: "Song 5", artist: "Artist E" },
  ];
  return (
    <>
      <div className="left-aligned-container">
        <div>
          <h1 className="top-header">Top Songs</h1>
        </div>
        <div>
          <TimeFilter changeTime={changeTime} />
        </div>
        <div>
          <SquareContainer type={"songs"} top={songs} />
        </div>
      </div>
    </>
  );
};

export default TopSongs;
