import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchProfileById, updateProfile } from "../api";
import './ProfilePage.css';
import './EditProfile.css';

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
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const locationState = location.state as { message?: string, editMode?: boolean } | null;
    
    if (locationState?.message) {
      setSuccessMessage(locationState.message);
      // Clear the location state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
    
    // Check if we should enter edit mode from navigation state
    if (locationState?.editMode) {
      setIsEditMode(true);
    }

    fetchProfile();
  }, [id, location]);

  const fetchProfile = async () => {
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
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData(event.currentTarget);
      const formEntries = Object.fromEntries(formData);
      
      // Convert years_of_experience to number if present
      const years = formEntries.years_of_experience ? 
        Number(formEntries.years_of_experience) : undefined;
      
      // Convert areas_of_interest to array if present
      const areasString = formEntries.areas_of_interest as string;
      const areas = areasString ? 
        areasString.split(',').map(area => area.trim()).filter(area => area) : 
        undefined;
      
      const updatedProfile: Profile = {
        id: id as string,
        username: formEntries.username as string,
        display_name: formEntries.display_name as string,
        cohort: formEntries.cohort as string || undefined,
        current_role: formEntries.current_role as string || undefined,
        company_or_university: formEntries.company_or_university as string || undefined,
        years_of_experience: years,
        areas_of_interest: areas
      };
      
      const response = await updateProfile(Number(id), updatedProfile);
      
      if (response && response.success) {
        setProfile(updatedProfile);
        setSuccessMessage("Profile updated successfully!");
        setIsEditMode(false);
      } else {
        setError(response?.message || "Failed to save profile changes.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred while saving.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate('/whos-who');
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setError(null);
  };

  // Shared loading and error states
  if (isLoading) {
    return (
      <div className="profile-container loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && !isEditMode) {
    return (
      <div className="profile-container error">
        <p>{error || 'Profile not found'}</p>
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

  // Render different content based on mode
  return (
    <div className={`profile-container ${isEditMode ? 'edit-mode' : 'view-mode'}`}>
      <div className="profile-header">
        <button onClick={handleBack} className="back-button">
          ← Back 
        </button>
        {!isEditMode ? (
          <button onClick={handleEdit} className="edit-button">
            Edit Profile
          </button>
        ) : null}
      </div>

      {successMessage && !isEditMode && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {!isEditMode ? (
        // View Mode
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
      ) : (
        // Edit Mode
        <div className="edit-profile-container">
          <h1>Edit Profile</h1>
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="display_name">Display Name:</label>
              <input
                id="display_name"
                type="text"
                name="display_name"
                defaultValue={profile.display_name || ''}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                defaultValue={profile.username || ''}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cohort">Cohort:</label>
              <input
                id="cohort"
                type="text"
                name="cohort"
                defaultValue={profile.cohort || ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="current_role">Current Role:</label>
              <input
                id="current_role"
                type="text"
                name="current_role"
                defaultValue={profile.current_role || ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="company_or_university">Company/University:</label>
              <input
                id="company_or_university"
                type="text"
                name="company_or_university"
                defaultValue={profile.company_or_university || ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="years_of_experience">Years of Experience:</label>
              <input
                id="years_of_experience"
                type="number"
                name="years_of_experience"
                defaultValue={profile.years_of_experience || ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="areas_of_interest">Areas of Interest (comma-separated):</label>
              <input
                id="areas_of_interest"
                type="text"
                name="areas_of_interest"
                defaultValue={profile.areas_of_interest?.join(', ') || ''}
              />
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="button-group">
              <button 
                type="submit" 
                className="save-button" 
                disabled={isProcessing}
              >
                {isProcessing ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={handleCancel}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;