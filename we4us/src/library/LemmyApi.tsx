import { LemmyHttp } from "lemmy-js-client";
import { INSTANCE_URL } from "../constants";
import { PostView, GetPostResponse } from 'lemmy-js-client';
// TODO: improve the error handling

export function getClient(): LemmyHttp{
  // Adapted from [voyager](https://github.com/aeharding/voyager/blob/1498afe1a1e4b1b63d31035a9f73612b7534f42c/src/services/lemmy.ts#L16)
  // TODO: Use a common client object to reduce waste
  const jwt = localStorage.getItem("token");
  return new LemmyHttp(
    INSTANCE_URL,  {
    headers: {
      ["Cache-Control"]: "no-cache", // otherwise may get back cached site response (despite JWT)
      ...(jwt && { Authorization: `Bearer ${jwt}`})
    }
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

export async function logIn(username: string, password: string){
  try{
  const response = await getClient().login(
    {
      username_or_email: username,
      password: password
    }
  );
  return response.jwt;
}
catch (error){
  return null;
}
}

export async function logOut(){
  const response = await getClient().logout();
  return response.success;
}

export function getDepthFromComment(
  comment?: Comment,
): number | undefined {
  const len = comment?.path.split(".").length;
  return len ? len - 2 : undefined;
}