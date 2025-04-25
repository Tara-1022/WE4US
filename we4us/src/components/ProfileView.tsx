import '../styles/ProfilePage.css';
import LemmyPersonDetails from './LemmyPersonDetails';
import { Pencil } from 'lucide-react';
import { Profile } from '../library/PostgresAPI';
import { constructImageUrl } from "../library/ImageHandling";
import ReactMarkdown from "react-markdown";
import profile_duck from "../assets/profile_duck.png";


interface ProfileViewProps {
  profile: Profile;
  onEdit?: () => void;
}

const ProfileView = ({ profile, onEdit }: ProfileViewProps) => {
  return (
    <div className="profile-content">
      {onEdit && (
        <button onClick={onEdit} className="edit-button">
          <Pencil />
        </button>
      )}
      <div className="profile-image-container">
        <img
          src={profile.image_filename ? constructImageUrl(profile.image_filename) : profile_duck}
          alt={`${profile.display_name}'s profile`}
          className="profile-image"
        />
      </div>
      <h1>{profile.display_name}</h1>
      <p className="username">@{profile.username}</p>
      <div className="profile-details">
        {profile.cohort && (
          <div className="detail-item">
            <span className="detail-label">Cohort:</span>
            <span className="detail-value">{profile.cohort}</span>
          </div>
        )}
        {profile.current_role && (
          <div className="detail-item">
            <span className="detail-label">Current Role:</span>
            <span className="detail-value">{profile.current_role}</span>
          </div>
        )}
        {profile.company_or_university && (
          <div className="detail-item">
            <span className="detail-label">Company/University:</span>
            <span className="detail-value">{profile.company_or_university}</span>
          </div>
        )}
        {profile.years_of_experience !== undefined && profile.years_of_experience !== null && (
          <div className="detail-item">
            <span className="detail-label">Years of Experience:</span>
            <span className="detail-value">{profile.years_of_experience}</span>
          </div>
        )}
        {profile.areas_of_interest && profile.areas_of_interest.length > 0 && (
          <div className="large-detail">
            <h3>Areas of Interest</h3>
            <ul>
              {profile.areas_of_interest.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="large-detail">
          <h3>Description:</h3>
          <div className="description">
            <ReactMarkdown>
              {profile.description || "No description yet!"}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      {profile.username &&
        <LemmyPersonDetails username={profile.username} />
      }
    </div>
  );
};
export default ProfileView;