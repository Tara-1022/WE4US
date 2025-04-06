import React, { useState } from "react";
import { ProfileImageDetailsType, uploadProfileImage, deleteProfileImage, constructProfileImageUrl } from "../library/ProfileImageHandling";
import default_avatar from "../assets/profile_duck.png"; 

interface ProfileImageUploaderProps {
  currentImage?: ProfileImageDetailsType;
  onImageChange: (imageDetails: ProfileImageDetailsType | undefined) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ 
  currentImage, 
  onImageChange 
}) => {
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files || !event.target.files[0]) {
      console.log("No file selected");
      return;
    }

    setLoading(true);
    
    // Delete previous image if it exists
    if (currentImage) {
      try {
        await deleteProfileImage(currentImage);
      } catch (error) {
        console.error("Error deleting previous image:", error);
        // Continue with upload even if delete fails
      }
    }

    const file = event.target.files[0];
    
    try {
      const imageDetails = await uploadProfileImage(file);
      console.log("Image uploaded:", imageDetails);
      onImageChange(imageDetails);
    } catch (error) {
      console.error("Error uploading image:", error);
      window.alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    if (!currentImage) return;
    
    setLoading(true);
    
    try {
      await deleteProfileImage(currentImage);
      onImageChange(undefined);
      window.alert("Image deleted");
    } catch (error) {
      console.error("Error deleting image:", error);
      window.alert("Failed to delete image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-image-uploader">
      <div className="image-preview">
        <img 
          src={currentImage ? constructProfileImageUrl(currentImage.filename) : default_avatar} 
          alt="Profile" 
          style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
      
      <div className="image-controls">
        <input
          id="profileImageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
        />
        
        {currentImage && (
          <button 
            onClick={handleImageDelete}
            disabled={loading}
          >
            Remove Image
          </button>
        )}
        
        {loading && <span>Processing...</span>}
      </div>
    </div>
  );
};

export default ProfileImageUploader;