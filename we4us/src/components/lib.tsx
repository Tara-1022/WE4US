import { LemmyHttp } from "lemmy-js-client";
import { INSTANCE_URL } from "../constants";
import { PostView, GetPostResponse } from 'lemmy-js-client';
// TODO: improve the error handling

export function getClient(jwt?: string): LemmyHttp{
  // Adapted from [voyager](https://github.com/aeharding/voyager/blob/1498afe1a1e4b1b63d31035a9f73612b7534f42c/src/services/lemmy.ts#L16)
  // TODO: Use a common client object to reduce waste
  return new LemmyHttp(
    INSTANCE_URL,  {
    headers: jwt? {
          Authorization: `Bearer ${jwt}`,
          ["Cache-Control"]: "no-cache", // otherwise may get back cached site response (despite JWT)
        }
      : undefined,
  });
}

export async function getPostById(postId: number): Promise<GetPostResponse | null>{
  // Return PostResponse, or null if fetch fails
  try{
    return getClient().getPost(
      {
        id: postId
      }
      );
  }
  catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPostList() :Promise<PostView[]>{
  // Fetches and returns a list of recent 25 PostViews
  // or an empty list if fetch fails
    let postCollection: PostView[] = [];
    try{
        const response = await getClient().getPosts(
          {
            type_: "All",
            limit: 25
          }
        );
        postCollection = response.posts.slice();
    }
    catch (error) {
      console.error(error);
    }
    finally{
        return postCollection;
    }
}