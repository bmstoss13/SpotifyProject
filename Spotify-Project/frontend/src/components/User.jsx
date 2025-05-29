import React from "react";
import "./User.css";
import { CiUser } from "react-icons/ci";

const User = ({ profileName, image, onClick }) => {
  return (
    <div className="user-card" onClick={onClick} style={{ cursor: "pointer" }}>
      {image ? (
        <img src={image} alt={`${profileName}'s profile`} className="user-image" />
      ) : (
        <CiUser className="user-icon" />
      )}
      <p className="user-name">{profileName}</p>
    </div>
  );
};

export default User;