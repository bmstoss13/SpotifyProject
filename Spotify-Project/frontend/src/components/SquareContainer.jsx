import React from "react";
import Song from "./Song";
import Artist from "./Artist";
import User from "./User";
import "./SquareContainer.css";

// Sample song data (replace or expand this as needed)


const SquareContainer = ({type, top, onUserClick}) => {
  return (
    <div className="grid-container">
      {type==="songs" && top.map((song, index) => (
        <Song
          key={index}
          track={song.track}
          artists={song.artists}
          page={song.page}
          pfp={song.pfp}
        />
      ))}
      {type==="artists" && top.map((artist, index) => (
        <Artist
          key={index}
          artist={artist.artist}
          pfp={artist.pfp}
          page={artist.page}
        />
      ))}
      {type==="user" && top.map((user, index) => (
        <User
          key={index}
          profileName={user.profileName}
          image={user.image}
          onClick={() => onUserClick(user.id)}
        />
      ))}

    </div>
  );
};

export default SquareContainer;
