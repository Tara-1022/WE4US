import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfileById, Profile } from "../library/PostgresAPI";
import { Loader } from "lucide-react";
import ProfileView from "../components/ProfileView";
import ProfileEditForm from "../components/ProfileEditForm";



const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    fetchProfileById(Number(id))
      .then(response => {
        if (response && response.profile) {
          setProfile(response.profile);
        } else {
          setError("Profile not found");
        }
      })
      .catch(err => setError(err instanceof Error ? err.message : "An error occurred"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    setSuccessMessage("Profile updated successfully!");
    setIsEditMode(false);
  };

  const handleBack = () => {
    navigate('/whos-who');
  };

  if (isLoading) {
    return (
      <div className="profile-container loading">
        <Loader className="loading-spinner" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-container error">
        <p>{error}</p>
        <div className="button-group">
          <button onClick={handleBack}>Back to Who's Who</button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container error">
        <p>Profile not found</p>
        <div className="button-group">
          <button onClick={handleBack}>Back to Who's Who</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-container ${isEditMode ? "edit-mode" : "view-mode"}`}>
      <div className="profile-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
      </div>

      {successMessage && !isEditMode && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {isEditMode ? (
        <ProfileEditForm 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate} 
          onCancel={() => setIsEditMode(false)} 
        />
      ) : (
        <ProfileView 
          profile={profile} 
          onEdit={() => setIsEditMode(true)} 
        />
      )}
    </div>
  );
};

export default ProfilePage;