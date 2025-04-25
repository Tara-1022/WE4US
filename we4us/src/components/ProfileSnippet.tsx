import React from "react";
import { Link } from "react-router-dom";
import { constructImageUrl } from '../library/ImageHandling';
import DuckAvatar from '../assets/profile_duck.png';
import "../styles/ProfileSnippet.css";
import { formatToN } from "../library/Utils";
import { Profile } from "../library/PostgresAPI";

interface ProfileSnippetProps {
  profile: Profile
}

const ProfileSnippet: React.FC<ProfileSnippetProps> = ({ profile }) => {
  const { username, display_name, image_filename } = profile;

  const profileImageUrl = image_filename
    ? constructImageUrl(image_filename)
    : DuckAvatar;

  return (
    <Link to={`/profile/${username}`} className="profile-snippet">
      <div>
        <img src={profileImageUrl} alt={display_name} className="profile-image" />
        <h3 className="display-name">{formatToN(display_name, 15)}</h3>
        <p className="username">@{username}</p>
      </div>
    </Link>
  );
};

export default ProfileSnippet;