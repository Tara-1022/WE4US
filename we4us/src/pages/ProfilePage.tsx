import React from 'react';
import './ProfilePage.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchProfileById } from "../api";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  cohort?: string;
  current_role?: string;
  company_or_university?: string;
  years_of_experience?: number;
  areas_of_interest?: string[];
}

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const locationState = location.state as { message?: string } | null;
    if (locationState?.message) {
      setSuccessMessage(locationState.message);
      window.history.replaceState({}, document.title);
    }

    const getProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchProfileById(Number(id));

        if (response && response.profile) {
          setProfile({ ...response.profile });
        } else {
          setError("Profile not found.");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [id, location]);

  const handleBack = () => {
    navigate('/whos-who');
  };

  if (isLoading) {
    return (
      <div className="profile-container loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-container error">
        <p>{error || 'Profile not found'}</p>
        <div className="button-group">
          <button onClick={handleBack}>Back to Who's Who</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={handleBack} className="back-button">
          ← Back 
        </button>
        <button 
          onClick={() => navigate(`/edit/${id}`)} 
          className="edit-button"
        >
          Edit Profile
        </button>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

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
      </div>
    </div>
  );
};

export default ProfilePage;