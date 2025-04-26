import { useState } from "react";
import { updateProfile, Profile } from "../library/PostgresAPI";
import '../styles/EditProfile.css';
import { useProfileContext } from "./ProfileContext";
import ImageUploader from "./ImageUploader";
import { ImageDetailsType, deleteImage } from "../library/ImageHandling";

interface ProfileEditFormProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
  onCancel: () => void;
}

const ProfileEditForm = ({ profile, onProfileUpdate, onCancel }: ProfileEditFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profileInfo } = useProfileContext();
  const [uploadedImage, setUploadedImage] = useState<ImageDetailsType | undefined>(undefined);
  const [deleteOldImage, setDeleteOldImage] = useState(false);

  // Derived state for current details
  const originalImage = profile.image_filename && profile.image_delete_token ?
    {
      filename: profile.image_filename,
      deleteToken: profile.image_delete_token
    } : undefined;

  // They shouldn't reach this view in the first place. Even if, through some
  // bug, they do see this component, it should not allow edits.
  if (profileInfo?.username != profile.username) {
    return (
      <>
        <p>
          You cannot edit this profile. If you're seeing this page, there's
          some bug. Please screenshot, document your steps and share with the developers.
        </p>
      </>
    )
  }

  function validateDisplayName(displayName: string) {
    // https://github.com/LemmyNet/lemmy/blob/d993f6cff7804f0b07b5f76c31f4efb29860f7ba/crates/utils/src/utils/validation.rs#L128C8-L128C29
    const displayNameRegex = /^[A-Za-z0-9 _\.,!\?;:\\\-\<\>\(\)\#\$\%\^\*&]+$/;
    if (!displayNameRegex.test(displayName)) {
      setError("Display name must not have special characters, invisble whitespaces, or newline");
      return false;
    }
    return true;
  }

  const handleImageChange = (newImageDetails: ImageDetailsType[] | undefined) => {
    if (newImageDetails === undefined) {
      setUploadedImage(undefined);
      setDeleteOldImage(false);
    }
    else {
      if (newImageDetails.length == 0) {
        setUploadedImage(undefined)
        setDeleteOldImage(true)
      }
      else {
        setUploadedImage(newImageDetails[0])
        setDeleteOldImage(true);
      }
    }
  };

  const handleCancel = () => {
    if (!uploadedImage) return;
    // Remove pending image
    deleteImage(uploadedImage)
    setUploadedImage(undefined);
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const { display_name, current_role, company_or_university,
      working_since, areas_of_interest, description }
      = Object.fromEntries(formData);

    const areas: string[] = areas_of_interest.toString().split(",").map((area: string) => area.trim());

    if (!validateDisplayName(display_name.toString())) {
      setIsProcessing(false);
      return;
    }

    try {
      if (deleteOldImage && originalImage) {
        // Delete the original image after the new one is confirmed
        await deleteImage(originalImage).catch(err => {
          console.error("Error deleting original profile image:", err);
          throw err;
        }
        );
      }

      const response = await updateProfile(profile.username, {
        username: profile.username,
        display_name: display_name.toString(),
        current_role: current_role?.toString() || "",
        company_or_university: company_or_university?.toString() || "",
        areas_of_interest: areas,
        image_filename: uploadedImage?.filename ||
          (deleteOldImage ? null : originalImage?.filename),
        image_delete_token: uploadedImage?.deleteToken ||
          (deleteOldImage ? null : originalImage?.deleteToken),
        description: description?.toString() || "",
        working_since: working_since?.toString() || ""
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
        {/* Add Profile Image Uploader at the top */}
        <div className="form-group profile-image-section">
          <label>Profile Picture:</label>
          <ImageUploader
            originalImage={originalImage}
            onUploadChange={handleImageChange}
            copiesCount={1}
            purpose="profile"
          />
        </div>

        <div className="form-group">
          <label htmlFor="display_name">Display Name:</label>
          <input
            type="text"
            name="display_name"
            defaultValue={profile.display_name || ''}
            minLength={3}
            maxLength={20}
            required
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
          <label htmlFor="working_since">Working Since:</label>
          <input
            type="text"
            name="working_since"
            defaultValue={profile.working_since || ''}
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
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            defaultValue={profile.description || ''}
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
  );
};

export default ProfileEditForm;