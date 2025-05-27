import React from 'react';
import Song from '../components/Song'; 
import SquareContainer from '../components/SquareContainer';
const TopSongs = () => {
  const songs =[
    { title: "Song 1", artist: "Artist A" },
    { title: "Song 2", artist: "Artist B" },
    { title: "Song 3", artist: "Artist C" },
    { title: "Song 4", artist: "Artist D" },
    { title: "Song 5", artist: "Artist E" }
  ]
  return (
    <div>
     <SquareContainer type={"songs"} top={songs}/>
    </div>
  );
};

export default TopSongs;
