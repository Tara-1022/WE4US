import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfileByUsername } from "../library/PostgresAPI"; 
import { useProfileContext } from '../components/ProfileContext';
import { Loader } from 'lucide-react';
import ProfileEditForm from '../components/EditProfile';
import ProfileView from '../components/ProfileView';
import '../styles/ProfilePage.css';

// Interface matching the return type from fetchProfileByUsername
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
  const { username: paramUsername } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { profileInfo } = useProfileContext();

  const username = paramUsername || profileInfo?.userName; 
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    const getProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchProfileByUsername(username);

        if (!response) {
          setError("Profile not found.");
          return;
        }

        setProfile(response);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };    

    getProfile();
  }, [username, navigate]);
  
  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    setUpdateMessage("Profile updated successfully!");
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setUpdateMessage(null);
    }, 3000);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <Loader size={48} className="loading-spinner"/>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="error">
        <p>{error || 'Profile not found'}</p>
        <button className="back-button" onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>← Back</button>
      </div>
      
      {updateMessage && (
        <div className="success-message">
          {updateMessage}
        </div>
      )}
      
      {isEditing ? (
        <ProfileEditForm 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <ProfileView 
          profile={profile} 
          onEdit={handleEditToggle} 
        />
      )}
    </div>
  );
};

export default ProfilePage;