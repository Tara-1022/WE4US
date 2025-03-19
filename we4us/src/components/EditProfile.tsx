import { useState } from "react";
import { API_BASE_URL, PROFILES_ENDPOINT } from "../constants";
import '../styles/EditProfile.css';

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

const updateProfile = async (username: string, profileData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}${PROFILES_ENDPOINT}/by_username/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const data = await response.json();
      return { profile: data.profile, message: "Profile updated successfully" };
    } catch (error) {
      if (error instanceof Error) {
        return { profile: null, message: error.message };
      } else {
        return { profile: null, message: "Unknown error occurred." };
      }
    }
  };

interface ProfileEditFormProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
  onCancel: () => void;
}

const ProfileEditForm = ({ profile, onProfileUpdate, onCancel }: ProfileEditFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const { display_name, username, cohort, current_role, company_or_university, years_of_experience, areas_of_interest }
      = Object.fromEntries(formData);

    const areas: string[] = areas_of_interest.toString().split(",").map((area: string) => area.trim());
    
    try {
      const response = await updateProfile(profile.username, {
        id: profile.id,
        display_name: display_name.toString(),
        username: username.toString(),
        cohort: cohort?.toString() || "",
        current_role: current_role?.toString() || "",
        company_or_university: company_or_university?.toString() || "",
        years_of_experience: years_of_experience ? Number(years_of_experience) : null,
        areas_of_interest: areas
      });

      if (!response.profile) {
        throw new Error(response.message || "Failed to update profile.");
      }
      
      onProfileUpdate(response.profile);
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
            type="text"
            name="display_name"
            defaultValue={profile.display_name || ''}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            defaultValue={profile.username || ''}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cohort">Cohort:</label>
          <input
            type="text"
            name="cohort"
            defaultValue={profile.cohort || ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="current_role">Current Role:</label>
          <input
            type="text"
            name="current_role"
            defaultValue={profile.current_role || ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_or_university">Company/University:</label>
          <input
            type="text"
            name="company_or_university"
            defaultValue={profile.company_or_university || ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="years_of_experience">Years of Experience:</label>
          <input
            type="number"
            name="years_of_experience"
            defaultValue={profile.years_of_experience || ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="areas_of_interest">Areas of Interest (comma-separated):</label>
          <input
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