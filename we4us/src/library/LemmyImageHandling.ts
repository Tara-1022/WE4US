import { LEMMY_IMAGE_URL } from "../constants"
import { getClient } from "./LemmyApi"

export type ImageDetailsType = {
  filename: string,
  deleteToken: string
}

// https://github.com/LemmyNet/lemmy-ui/blob/c15a0eb1e5baa291e175567967db4c3205711807/src/shared/components/common/image-upload-form.tsx#L73
export async function uploadImage(image: File): Promise<ImageDetailsType> {
  try {
    const response = await getClient().uploadImage({ image: image })
    console.log(response)
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
  const response = await getClient().deleteImage({
    token: image.deleteToken,
    filename: image.filename
  })
  if (!response) throw new Error("Image could not be deleted");
  return response;
}

export function constructImageUrl(image: ImageDetailsType): string {
  return LEMMY_IMAGE_URL + image.filename;
}