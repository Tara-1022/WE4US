import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProfileByUsername, Profile } from "../library/PostgresAPI";
import { useProfileContext } from '../components/ProfileContext';
import { Loader } from 'lucide-react';
import ProfileEditForm from '../components/EditProfile';
import ProfileView from '../components/ProfileView';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { profileInfo, setProfileInfo } = useProfileContext();

  const username = paramUsername || profileInfo?.username;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!username) {
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
  }, [username]);
  
  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);

    setProfileInfo(
      (prevProfileInfo) => {
        if (prevProfileInfo)
          return {
            ...updatedProfile,
            displayName: updatedProfile.display_name,
            userName: prevProfileInfo.username, // username never changes anyway
            lemmyId: prevProfileInfo.lemmyId,
            isAdmin: prevProfileInfo.isAdmin
          }
        else throw new Error("No profile to update")
      });

    setIsEditing(false);
    window.alert("Profile updated successfully!");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <Loader size={48} className="loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="error">
        <p>{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {isEditing && (profileInfo?.username == profile.username)
        ? (
          <ProfileEditForm
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />)
        : (
          <ProfileView
            profile={profile}
            isOfCurrentUser={
              (profileInfo?.username == profile.username) ? true : false}
              onEdit={handleEditToggle}
          />)
      }
    </div>
  );
};

export default ProfilePage;
