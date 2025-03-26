import React from "react";
import { Link } from "react-router-dom";
import "./ProfileSnippet.css";

interface ProfileSnippetProps {
  displayName: string;
  username: string;
}

const ProfileSnippet: React.FC<ProfileSnippetProps> = ({ displayName, username }) => {
  return (
    <Link to={`/profile/${username}`} className="profile-snippet">
      <div>
        <h3>{displayName}</h3>
        <p>@{username}</p>
      </div>
    </Link>
  );
};

export default ProfileSnippet;