import { LEMMY_IMAGE_URL } from "../constants";
import { getClient } from "./LemmyApi";

export type ProfileImageDetailsType = {
  filename: string,
  deleteToken: string
};

export async function uploadProfileImage(image: File): Promise<ProfileImageDetailsType> {
  try {
    const response = await getClient().uploadImage({ image: image });
    if (!(response.msg == "ok"))
      throw new Error(response.msg);

    if (!response.files || !response.delete_url || !response.url)
      throw new Error("No file information returned");

    return {
      deleteToken: response.files[0].delete_token,
      filename: response.files[0].file
    };
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
}

export async function deleteProfileImage(image: ProfileImageDetailsType) {
  const response = await getClient().deleteImage({
    token: image.deleteToken,
    filename: image.filename
  });
  if (!response) throw new Error("Image could not be deleted");
  return response;
}

export function constructProfileImageUrl(filename: string): string {
  return LEMMY_IMAGE_URL + filename;
}