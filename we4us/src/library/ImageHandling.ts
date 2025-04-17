import { LEMMY_IMAGE_URL } from "../constants"
import { getClient } from "./LemmyApi"

export type ImageDetailsType = {
  filename: string,
  deleteToken: string
}

export async function checkImageExists(image: ImageDetailsType | string): Promise<boolean> {
  try {
    const url = constructImageUrl(image);
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    console.error("Error checking if image exists:", error);
    return false;
  }
}

// https://github.com/LemmyNet/lemmy-ui/blob/c15a0eb1e5baa291e175567967db4c3205711807/src/shared/components/common/image-upload-form.tsx#L73
export async function uploadImage(image: File): Promise<ImageDetailsType> {
  try {
    const response = await getClient().uploadImage({ image: image })
    if (!(response.msg == "ok"))
      throw new Error(response.msg);

    if (!response.files || !response.delete_url || !response.url)
      throw new Error("No file information returned")

    return {
      deleteToken: response.files[0].delete_token,
      filename: response.files[0].file
    }

  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
}

// https://github.com/LemmyNet/lemmy-ui/blob/c15a0eb1e5baa291e175567967db4c3205711807/src/shared/components/common/media-uploads.tsx#L80
export async function deleteImage(image: ImageDetailsType) {
  if (
    !image ||
    !image.filename ||
    !image.deleteToken ||
    image.filename === "null" ||
    image.deleteToken === "null"
  ) {
    console.warn("Skipping image deletion: invalid or missing details", image);
    return;
  }

  const exists = await checkImageExists(image);
  if (!exists) {
    console.log("Image does not exist, skipping deletion:", image.filename);
    return;
  }

  const response = await getClient().deleteImage({
    token: image.deleteToken,
    filename: image.filename
  });

  if (!response) throw new Error("Image could not be deleted");
  return response;
}

export function constructImageUrl(input: ImageDetailsType | string): string {
  if (typeof input === 'object' && input.filename) {
    return LEMMY_IMAGE_URL + input.filename;
  }
  
  if (typeof input === 'string') {
    return LEMMY_IMAGE_URL + input;
  }

  console.error("Invalid input to constructImageUrl:", input);
  throw new Error("Input must be ImageDetailsType or string");
}

export function getProfileImageUrl(profile: any): string {
  if (profile?.image_filename) {
    return constructImageUrl(profile.image_filename);
  }
  return "/assets/profile_duck.png"; 
}