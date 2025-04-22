import React from "react";
import { Link } from "react-router-dom";
import { constructImageUrl } from '../library/ImageHandling'; 
import DuckAvatar from '../assets/profile_duck.png';
import "./ProfileSnippet.css";

interface ProfileSnippetProps {
  profile: {
    username: string;
    display_name: string;
    image_filename?: string | null;  
  };
}

const ProfileSnippet: React.FC<ProfileSnippetProps> = ({ profile }) => {
  const { username, display_name, image_filename } = profile;
  
  const profileImageUrl = image_filename 
    ? constructImageUrl(image_filename)
    : DuckAvatar;

  return (
    <Link to={`/profile/${username}`} className="profile-snippet">
      <div>
        <img src={profileImageUrl} alt={display_name} className="profile-w-image" />
        <h3>{display_name}</h3>
        <p>@{username}</p>
      </div>
    </Link>
  );
};

export default ProfileSnippet;