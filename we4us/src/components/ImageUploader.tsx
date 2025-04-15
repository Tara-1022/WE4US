import React, { useState } from "react";
import { ImageDetailsType, uploadImage, deleteImage, constructImageUrl } from "../library/ImageHandling";
import default_avatar from "../assets/profile_duck.png"; 
import default_post_image from "../assets/default_image.png";
import { imageStyles } from "../styles/ImageStyles";

interface ImageUploaderProps {
  currentImage?: ImageDetailsType;
  onImageChange: (imageDetails: ImageDetailsType | undefined) => void;
  purpose?: 'profile' | 'post';
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentImage, 
  onImageChange, 
  purpose = 'profile',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);

  const defaultImage = purpose === 'profile' ? default_avatar : default_post_image;

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
        await deleteImage(currentImage);
      } catch (error) {
        console.error("Error deleting previous image:", error);
        
        // Check if it's because the image doesn't exist
        if (error instanceof Error && error.message.includes("image does not exist")) {
          console.log("Image already deleted or doesn't exist, proceeding with upload");
        } else {
          // Stop the process if deletion fails for other reasons
          setLoading(false);
          window.alert("Failed to remove previous image. Please try again later.");
          return;
        }
      }
    }

    const file = event.target.files[0];
    
    try {
      const imageDetails = await uploadImage(file);
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
      await deleteImage(currentImage);
      onImageChange(undefined);
      window.alert("Image deleted");
    } catch (error) {
      console.error("Error deleting image:", error);
      window.alert("Failed to delete image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const imageStyle = purpose === 'profile' 
    ? imageStyles.profile 
    : imageStyles.post;

  return (
    <div className={`image-uploader ${purpose}-image-uploader ${className}`}>
      <div className="image-preview">
        <img 
          src={currentImage?.filename ? constructImageUrl(currentImage.filename) : defaultImage} 
          alt={`${purpose} image`} 
          style={imageStyle as React.CSSProperties}
        />
      </div>
      
      <div className="image-controls">
        <input
          id={`${purpose}ImageUpload`}
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

export default ImageUploader;