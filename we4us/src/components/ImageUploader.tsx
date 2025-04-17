import React, { useState } from "react";
import { ImageDetailsType, uploadImage, constructImageUrl } from "../library/ImageHandling";
import default_avatar from "../assets/profile_duck.png"; 
import default_post_image from "../assets/default_image.png";
import { imageStyles } from "../styles/ImageStyles";

interface ImageUploaderProps {
  currentImage?: ImageDetailsType;
  onImageChange: (imageDetails: ImageDetailsType | undefined) => void;
  onMultipleUploads?: (imageDetails: ImageDetailsType[]) => void;
  copiesCount?: number;
  purpose?: 'profile' | 'post';
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentImage, 
  onImageChange, 
  onMultipleUploads,
  copiesCount = 1,
  purpose = 'profile',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [tempImage, setTempImage] = useState<ImageDetailsType | undefined>(currentImage);

  const defaultImage = purpose === 'profile' ? default_avatar : default_post_image;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files || !event.target.files[0]) {
      console.log("No file selected");
      return;
    }

    setLoading(true);
    const file = event.target.files[0];

    try {
      // Upload the primary image
      const primaryImageDetails = await uploadImage(file);
      console.log("Primary image uploaded:", primaryImageDetails);

      setTempImage(primaryImageDetails);
      onImageChange(primaryImageDetails);

      // If additional copies are requested, upload them too
      if (onMultipleUploads && copiesCount > 1) {
        const copies: ImageDetailsType[] = [primaryImageDetails];
        
        // Create additional copies
        for (let i = 1; i < copiesCount; i++) {
          const copyDetails = await uploadImage(file);
          copies.push(copyDetails);
        }
        
        onMultipleUploads(copies);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      window.alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setTempImage(undefined);
    onImageChange(undefined);
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
            onClick={handleRemoveImage}
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