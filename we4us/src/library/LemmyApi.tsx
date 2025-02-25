import { INSTANCE_URL } from "../constants";
import { LemmyHttp, PostView, GetPostResponse, CommentView, CreateComment, MyUserInfo, Comment, CreatePost } from 'lemmy-js-client';
// TODO: improve the error handling
// TODO: have all functions either return the reponse, or unpack it
// for consistency. Not a mix of both. Unpacking should preferably be done
// at the parent component, to ensure all parts of the response are available should we need it

let client: LemmyHttp = new LemmyHttp(
  INSTANCE_URL, {
  headers: {
    ["Cache-Control"]: "no-cache"
  }
});

export function setClientToken(jwt: string | null) {
  client = new LemmyHttp(
    INSTANCE_URL, {
    headers: {
      ["Cache-Control"]: "no-cache", // otherwise may get back cached site response (despite JWT)
      ...(jwt && { Authorization: `Bearer ${jwt}` })
    }
  });
}

export function getClient(): LemmyHttp {
  // Adapted from [voyager](https://github.com/aeharding/voyager/blob/1498afe1a1e4b1b63d31035a9f73612b7534f42c/src/services/lemmy.ts#L16)
  // Do not set or reset the token in these functions
  return client;
}

// Keep things below ordered alphabetically

export async function createComment(createComment: CreateComment) {
  // Create comment and return resultant commentView
  const response = await getClient().createComment(createComment);
  return response.comment_view;
}

// https://mv-gh.github.io/lemmy_openapi_spec/#tag/Admin/paths/~1admin~1purge~1comment/post
// https://github.com/LemmyNet/lemmy/issues/2977
// Note: 'Delete' simply marks a coment/post as deleted. 
// It can be retrieved by flipping the 'delete' flag within 30 days
// Purging would remove it completely
// We will be deleting comments to avoid orphaning replies
export async function deleteComment(commentId: number) {
  const response = await getClient().deleteComment({
    comment_id: commentId, deleted: true
  });
  return response.comment_view;
}

export async function deletePost(postId: number) {
  const response = await getClient().deletePost(
    {
      post_id: postId, deleted: true
    }
  );
  return response.post_view;
}

export async function getComments(postId: number): Promise<CommentView[]> {
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
  finally {
    return commentCollection;
  }
}

export async function createPost(createPostData: CreatePost): Promise<PostView> {
  try {
    const response = await getClient().createPost(createPostData);
    return response.post_view;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
} 

export async function getPostById(postId: number): Promise<GetPostResponse | null>{
export async function createPost(createPostData: CreatePost): Promise<PostView> {
  try {
    const response = await getClient().createPost(createPostData);
    return response.post_view;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
} 

export async function getPostById(postId: number): Promise<GetPostResponse | null>{
  // Return PostResponse, or null if fetch fails
  try {
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

export async function getPostList(): Promise<PostView[]> {
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

export async function getCurrentUserDetails(): Promise<MyUserInfo | undefined> {
  const response = await getClient().getSite();
  return response.my_user;

}

export async function hidePost(postId:number){
  const response = await getClient().hidePost({
    post_ids: [postId],
    hide: true
  });
  return response.success;
}

export async function logIn(username: string, password: string) {
  // Log in and return jwt, or null if the login fails
  try {
    const response = await getClient().login(
      {
        username_or_email: username,
        password: password
      }
    );
    return response.jwt;
  }
  catch (error) {
    console.error(error)
    return null;
  }
}

export async function logOut() {
  // Request logout, return status of success
  const response = await getClient().logout();
  return response.success;
}