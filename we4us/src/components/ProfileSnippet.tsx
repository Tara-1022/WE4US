<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
import "./ProfileSnippet.css";

interface ProfileSnippetProps {
  id: number;
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

=======
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

>>>>>>> main
export default ProfileSnippet;