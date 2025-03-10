import { Profile } from "../api";
import './ProfilePage.css';

interface ProfileViewProps {
  profile: Profile;
  onEdit: () => void;
}

const ProfileView = ({ profile, onEdit }: ProfileViewProps) => {
  return (
    <div className="profile-content">
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

        {profile.years_of_experience && (
          <div className="detail-item">
            <span className="detail-label">Years of Experience:</span>
            <span className="detail-value">{profile.years_of_experience}</span>
          </div>
        )}

        {profile.areas_of_interest && profile.areas_of_interest.length > 0 && (
          <div className="areas-of-interest">
            <h3>Areas of Interest</h3>
            <ul>
              {profile.areas_of_interest.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button onClick={onEdit} className="edit-button">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileView;