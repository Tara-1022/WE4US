import { INSTANCE_URL } from "../constants";
import { LemmyHttp, PostView, GetPostResponse, CommentView, CreateComment } from 'lemmy-js-client';
// TODO: improve the error handling
// TODO: have all functions either return the reponse, or unpack it
// for consistency. Not a mix of both. Unpacking should preferably be done
// at the parent component, to ensure all parts of the response are available should we need it

export function getClient(): LemmyHttp{
  // Adapted from [voyager](https://github.com/aeharding/voyager/blob/1498afe1a1e4b1b63d31035a9f73612b7534f42c/src/services/lemmy.ts#L16)
  // Do not set or reset the token in these functions
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

// Keep things below ordered alphabetically

export async function createComment(createComment: CreateComment){
  // Create comment and return resultant commentView
  const response  = await getClient().createComment(createComment);
  return response.comment_view;
}

export async function getComments(postId: number): Promise<CommentView[]>{
  // Fetches and returns a list of comments for a post
  // or an empty list if fetch fails
  let commentCollection: CommentView[] = [];
  try{
      const response = await getClient().getComments(
        {
         post_id: postId,
         limit: 50
        }
      );
      commentCollection = response.comments.slice();
  }
  catch (error) {
    console.error(error);
  }
  finally{
      return commentCollection;
  }
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
            limit: 50
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
  // Log in and return jwt, or null if the login fails
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
  // Request logout, return status of success
  const response = await getClient().logout();
  return response.success;
}