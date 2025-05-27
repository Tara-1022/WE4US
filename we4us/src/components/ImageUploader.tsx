import React, { useEffect, useState } from "react";
import { ImageDetailsType, uploadImage, constructImageUrl, deleteImage } from "../library/ImageHandling";
import default_avatar from "../assets/profile_duck.png";
import default_post_image from "../assets/default_post_image.png";

interface ImageUploaderProps {
  onUploadChange: (imageDetails: ImageDetailsType[] | undefined) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  purpose: 'profile' | 'post';
  originalImage?: ImageDetailsType;
  copiesCount?: number;
  className?: string;
}

/**
Utility function. Use when originalImage is set; i.e, there is a previous image that needs to be handled
*/
export function handleStateChange({ newImageDetails, setUploadedImage, setDeleteOldImage }:
  {
    newImageDetails: ImageDetailsType[] | undefined;
    setUploadedImage: React.Dispatch<React.SetStateAction<ImageDetailsType | undefined>>;
    setDeleteOldImage: React.Dispatch<React.SetStateAction<boolean>>
  }
) {
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
}


/**
Handle image upload & deletion of uploaded images, as needed.
If OriginalImage is set, use handleStateChange
Will return copiesCount copies of the *same* image
If undefined, no image uploaded
If an empty list, delete the existing image
*/
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadChange,
  loading,
  setLoading,
  purpose,
  originalImage,
  copiesCount = 1,
  className = ''
}) => {
  const [uploadedCopies, setUploadedCopies] = useState<ImageDetailsType[] | undefined>(undefined);
  const hasUploaded = uploadedCopies != undefined;

  useEffect(() => {
    onUploadChange(uploadedCopies);
  }, [uploadedCopies])

  const deleteUploadedImage = async () => {
    if (!uploadedCopies) {
      setUploadedCopies([]);
      return;
    };
    for (const copy of uploadedCopies) {
      deleteImage(copy);
      console.log("deleted");
    }
    setUploadedCopies([]);
  }

  const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    deleteUploadedImage();
  };

  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    deleteUploadedImage();
    setUploadedCopies(undefined);
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files || !event.target.files[0]) {
      console.log("No file selected");
      return;
    }

    setLoading(true);
    deleteUploadedImage();
    const file = event.target.files[0];

    try {
      // Upload the primary image
      const copies: ImageDetailsType[] = [];

      for (let i = 1; i <= copiesCount; i++) {
        const copyDetails = await uploadImage(file);
        console.log("Uploaded ", i, " times");
        copies.push(copyDetails);
      }

      setUploadedCopies(copies);

    } catch (error) {
      console.error("Error uploading image:", error);
      window.alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const defaultImage = purpose === 'profile' ? default_avatar : default_post_image;

  const displayImage =
    hasUploaded ?
      (uploadedCopies.length > 0 ? constructImageUrl(uploadedCopies[0]) : defaultImage)
      :
      (originalImage ? constructImageUrl(originalImage) : defaultImage)

  return (
    <div className={`image-uploader ${purpose}-image-uploader ${className}`}>
      <div className="image-preview">
        <img
          src={displayImage}
          alt={`${purpose} image`}
          className={`${purpose}-image`}
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

        {originalImage && <button
          onClick={handleRemoveImage}
          disabled={loading}
        >
          Remove Image
        </button>}

        <button onClick={handleReset}>Reset</button>
        {loading && <span>Processing...</span>}
      </div>
    </div>
  );
};

export default ImageUploader;