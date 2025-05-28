import React from "react";
import "./User.css";

const User = ({ profileName, pfp }) => {
  return (
    <div className="user-card">
      <img src={pfp} alt={`${profileName}'s profile`} className="user-image" />
      <p className="user-name">{profileName}</p>
    </div>
  );
};

export default User;