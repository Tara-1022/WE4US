import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSnippet.css";

interface ProfileSnippetProps {
  id: number;
  displayName: string;
  username: string;
}

const ProfileSnippet: React.FC<ProfileSnippetProps> = ({ id, displayName, username }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-snippet" onClick={() => navigate(`/profile/${id}`)}>
      <div>
        <h3>{displayName}</h3>
        <p>@{username}</p>
      </div>
    </div>
  );
};

export default ProfileSnippet;
