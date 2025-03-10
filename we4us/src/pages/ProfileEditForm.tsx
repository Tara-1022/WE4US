import { useState } from "react";
import { Profile, updateProfile } from "../api";
import './EditProfile.css';

interface ProfileEditFormProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
  onCancel: () => void;
}

const ProfileEditForm = ({ profile, onProfileUpdate, onCancel }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAreasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const areasString = e.target.value;
    const areas = areasString
      ? areasString.split(',').map(area => area.trim()).filter(area => area)
      : [];
    
    setFormData(prev => ({
      ...prev,
      areas_of_interest: areas
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await updateProfile(Number(profile.id), formData);
      
      if (response && response.success) {
        onProfileUpdate(formData);
      } else {
        setError(response?.message || "Failed to update profile.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="display_name">Display Name:</label>
          <input
            id="display_name"
            type="text"
            name="display_name"
            value={formData.display_name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cohort">Cohort:</label>
          <input
            id="cohort"
            type="text"
            name="cohort"
            value={formData.cohort || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="current_role">Current Role:</label>
          <input
            id="current_role"
            type="text"
            name="current_role"
            value={formData.current_role || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_or_university">Company/University:</label>
          <input
            id="company_or_university"
            type="text"
            name="company_or_university"
            value={formData.company_or_university || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="years_of_experience">Years of Experience:</label>
          <input
            id="years_of_experience"
            type="number"
            name="years_of_experience"
            value={formData.years_of_experience || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="areas_of_interest">Areas of Interest (comma-separated):</label>
          <input
            id="areas_of_interest"
            type="text"
            name="areas_of_interest"
            value={formData.areas_of_interest?.join(', ') || ''}
            onChange={handleAreasChange}
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
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;