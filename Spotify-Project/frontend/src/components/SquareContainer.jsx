import React from "react";
import Song from "./Song";
import Artist from "./Artist";
import User from "./User";
import "./SquareContainer.css";

// Sample song data (replace or expand this as needed)


const SquareContainer = ({type, top}) => {
  return (
    <div className="grid-container">
      {type==="songs" && top.map((song, index) => (
        <Song
          key={index}
          title={song.title}
          artist={song.artist}
        />
      ))}
      {type==="artists" && top.map((artist, index) => (
        <Artist
          key={index}
          title={artist.artist}
          pfp={artist.pfp}
        />
      ))}
      {type==="user" && top.map((user, index) => (
        <User
          key={index}
          profileName={user.profileName}
          image={user.image}
        />
      ))}

    </div>
  );
};

export default SquareContainer;
