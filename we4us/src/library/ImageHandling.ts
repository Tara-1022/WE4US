import { LEMMY_IMAGE_URL, DEFAULT_POSTS_PER_PAGE } from "../constants"
import profile_duck from '../assets/profile_duck.png'
import { getClient } from "./LemmyApi"
import { Profile } from "./PostgresAPI"

export type ImageDetailsType = {
  filename: string,
  deleteToken: string
}

export async function listUserUploads({ page = 1, limit = DEFAULT_POSTS_PER_PAGE }
  : { page?: number, limit?: number }): Promise<ImageDetailsType[]> {
  try {
    const response = await getClient().listMedia({
      page, limit
    })
    return response.images.map(
      image => {
        return {
          filename: image.local_image.pictrs_alias,
          deleteToken: image.local_image.pictrs_delete_token
        } as ImageDetailsType
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
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
export async function deleteImage(image: ImageDetailsType, withAlert = true): Promise<boolean> {
  console.log("Asked to delete ", image)
  if (
    !image ||
    !image.deleteToken
  ) {
    if (withAlert) window.alert("Skipping image deletion: invalid or missing details");
    console.warn("Skipping image deletion: invalid or missing details", image);
    return true;
  }

  const response = await getClient().deleteImage({
    token: image.deleteToken,
    filename: image.filename
  });

  if (!response && withAlert) window.alert(
    "Image deletion failed: image is malformed," +
    " or does not exist. Please remove unused images through your profile page.")

  return response
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

export function getProfileImageSource(profile: Profile | undefined): string {
  if (profile?.image_filename) {
    return constructImageUrl(profile.image_filename);
  }
  return profile_duck;
}