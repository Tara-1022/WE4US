import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfileById, updateProfile } from "../api";
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

const EditProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [editedProfile, setEditedProfile] = React.useState<Profile | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchProfileById(Number(id));
        if (response && response.profile) {
          setProfile({ ...response.profile });
          setEditedProfile({ ...response.profile });
        } else {
          setError("Profile not found.");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    getProfile();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value ? Number(value) : undefined
      };
    });
  };

  const handleAreasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const areasArray = e.target.value ? e.target.value.split(',').map(item => item.trim()) : [];
    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        areas_of_interest: areasArray.length > 0 ? areasArray : undefined
      };
    });
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const response = await updateProfile(Number(id), editedProfile);
      
      if (response && response.success) {
        navigate(`/profile/${id}`, { 
          state: { 
            updatedProfile: editedProfile,
            message: "Profile updated successfully!" 
          } 
        });
      } else {
        setSaveError(response?.message || "Failed to save profile changes.");
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/profile/${id}`);
  };

  if (isLoading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="error-container">
        <p>{error || 'Profile not found'}</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h1>Edit Profile</h1>
        <form className="edit-profile-form" onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}>
          <div className="form-group">
            <label htmlFor="display_name">Display Name:</label>
            <input
              id="display_name"
              type="text"
              name="display_name"
              value={editedProfile?.display_name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              name="username"
              value={editedProfile?.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cohort">Cohort:</label>
            <input
              id="cohort"
              type="text"
              name="cohort"
              value={editedProfile?.cohort || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="current_role">Current Role:</label>
            <input
              id="current_role"
              type="text"
              name="current_role"
              value={editedProfile?.current_role || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company_or_university">Company/University:</label>
            <input
              id="company_or_university"
              type="text"
              name="company_or_university"
              value={editedProfile?.company_or_university || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="years_of_experience">Years of Experience:</label>
            <input
              id="years_of_experience"
              type="number"
              name="years_of_experience"
              value={editedProfile?.years_of_experience || ''}
              onChange={handleNumberInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="areas_of_interest">Areas of Interest (comma-separated):</label>
            <input
              id="areas_of_interest"
              type="text"
              name="areas_of_interest"
              value={editedProfile?.areas_of_interest?.join(', ') || ''}
              onChange={handleAreasChange}
            />
          </div>
          
          {saveError && (
            <div className="error-message">
              {saveError}
            </div>
          )}
          
          <div className="button-group">
            <button 
              type="submit" 
              className="save-button" 
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleCancel}
              disabled={isSaving}
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;