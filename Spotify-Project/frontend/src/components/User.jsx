import React from "react";
import "./User.css";
import { CiUser } from "react-icons/ci";

const User = ({ profileName, image }) => {
  return (
    <div className="user-card">
      {image ? (
        <img
          src={image}
          alt={`${profileName}'s profile`}
          className="user-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = "none";
          }}
        />
      ) : (
        <CiUser className="user-icon" />
      )}
      <p className="user-name">{profileName}</p>
    </div>
  );
};

export default User;