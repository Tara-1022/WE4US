import { LEMMY_INSTANCE_URL, ANNOUNCEMENTS_COMMUNITY_NAME, DEFAULT_POSTS_PER_PAGE, JOB_BOARD_COMMUNITY_NAME, DEFAULT_COMMENTS_DEPTH, MEET_UP_COMMUNITY_NAME, PG_FINDER_COMMUNITY_NAME } from "../constants";
import {
  LemmyHttp, PostView, GetPostResponse, Search,
  CommentView, CreateComment, SearchType, MyUserInfo, CreatePost,
  CommunityVisibility, EditPost
} from 'lemmy-js-client';

// TODO: improve the error handling
// TODO: have all functions either return the reponse, or unpack it
// for consistency. Not a mix of both. Unpacking should preferably be done
// at the parent component, to ensure all parts of the response are available should we need it

let client: LemmyHttp = new LemmyHttp(
  LEMMY_INSTANCE_URL, {
  headers: {
    ["Cache-Control"]: "no-cache"
  }
});

export function setClientToken(jwt: string | null) {
  client = new LemmyHttp(
    LEMMY_INSTANCE_URL, {
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

export type SearchParamsType = {
  query: string;
  communityId?: number;
  type?: SearchType;
  checkOnlyPostTitles?: boolean
}

// Keep things below ordered alphabetically

export async function createComment(createComment: CreateComment) {
  // Create comment and return resultant commentView
  const response = await getClient().createComment(createComment);
  return response.comment_view;
}

export async function createCommunity({ name, title }: { name: string, title: string }) {
  try {
    const response = await getClient().createCommunity({
      name: name,
      title: title,
      visibility: "LocalOnly" as CommunityVisibility
      // https://github.com/LemmyNet/lemmy-js-client/blob/main/src/types/CommunityVisibility.ts#L6
      // Since it's a private server with federation disabled, the default behaviour 
      // is equivalent to LocalOnly. Setting it for clarity anyway.
    });
    return response.community_view;
  }
  catch (error) {
    console.error("Error creating community:", error);
    throw new Error("Failed to create community: " + error);
  }
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
export async function createPost(createPostData: CreatePost): Promise<PostView> {
  try {
    const response = await getClient().createPost(createPostData);
    return response.post_view;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function deletePost(postId: number) {
  const response = await getClient().deletePost(
    {
      post_id: postId, deleted: true
    }
  );
  return response.post_view;
}

export async function editComment(commentId: number, content: string) {
  const response = await getClient().editComment(
    {
      comment_id: commentId,
      content: content
    }
  )
  return response.comment_view;
}

export async function editPost(newPostDetails: EditPost) {
  const response = await getClient().editPost(newPostDetails);
  return response.post_view;
}

export async function getAnnouncementPostList({ limit = DEFAULT_POSTS_PER_PAGE, page = 1 }
  : { limit?: number, page?: number }
): Promise<PostView[]> {
  // Fetches and returns a list of recent announcement PostViews
  let postCollection: PostView[] = [];
  try {
    const response = await getClient().getPosts({
      type_: "All",
      sort: "New",
      community_name: ANNOUNCEMENTS_COMMUNITY_NAME,
      show_nsfw: true,
      limit: limit,
      page: page,
    });
    postCollection = response.posts.slice();
    console.log(postCollection)
  } catch (error) {
    console.error(error);
  } finally {
    return postCollection;
  }
}

export async function getComments({ postId, parentId, maxDepth = DEFAULT_COMMENTS_DEPTH }:
  { postId?: number, parentId?: number, maxDepth?: number }): Promise<CommentView[]> {
  // Fetches and returns a list of comments for a post
  // or an empty list if fetch fails
  let commentCollection: CommentView[] = [];
  try {
    // Apparently if max_depth is provided, limit is ignored
    // https://github.com/LemmyNet/lemmy/blob/e7ddb96659e7ceff794f1ba4c2929a7f17dfe73b/crates/db_views/src/comment/comment_view.rs#L277
    // It doesn't make sense for us to use limits
    const response = await getClient().getComments(
      {
        post_id: postId,
        parent_id: parentId,
        max_depth: maxDepth
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

export async function getCommunityDetailsFromId(communityId: number) {
  const response = await getClient().getCommunity({
    id: communityId
  });
  return response.community_view;
}

export async function getCommunityDetailsFromName(name: string) {
  const response = await getClient().getCommunity({
    name: name
  });
  return response.community_view;
}

// https://github.com/LemmyNet/lemmy-ui/blob/main/src/shared/components/person/person-details.tsx#L297
export async function getPersonDetails(username: string) {
  const response = await getClient().getPersonDetails({
    username: username
  });
  return response;
}

export async function getPostById(postId: number): Promise<GetPostResponse | null> {
  // Return PostResponse, or null if fetch fails
  try {
    return await getClient().getPost(
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

export async function getPostList(
  { communityId, page = 1, limit = DEFAULT_POSTS_PER_PAGE }:
    { communityId?: number; page?: number; limit?: number }
): Promise<PostView[]> {
  let postCollection: PostView[] = [];
  try {
    const response = await getClient().getPosts({
      type_: "All",
      sort: "New",
      limit: limit,
      page: page,
      community_id: communityId,
      show_nsfw: false
    });
    postCollection = response.posts.slice();
  } catch (error) {
    console.error(error);
  }
  return postCollection;
}

export async function getJobPostList(page = 1, limit = DEFAULT_POSTS_PER_PAGE): Promise<PostView[]> {
  // Fetches and returns a list of recent PostViews
  // or an empty list if fetch fails
  let postCollection: PostView[] = [];
  try {
    const response = await getClient().getPosts(
      {
        type_: "All",
        limit: limit,
        page: page,
        community_name: JOB_BOARD_COMMUNITY_NAME,
        show_nsfw: true,
        sort: "New"
      }
    );
    postCollection = response.posts.slice();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    return postCollection;
  }
}

export async function getPgPostList(page = 1, limit = DEFAULT_POSTS_PER_PAGE): Promise<PostView[]> {
  let postCollection: PostView[] = [];
  try {
    const response = await getClient().getPosts(
      {
        type_: "All",
        limit: limit,
        page: page,
        community_name: PG_FINDER_COMMUNITY_NAME,
        show_nsfw: true,
        sort: "New"
      }
    );
    postCollection = response.posts.slice();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    return postCollection;
  }
}

export async function getMeetUpPostList(page = 1, limit = DEFAULT_POSTS_PER_PAGE): Promise<PostView[]> {
  let postCollection: PostView[] = [];
  try {
    const response = await getClient().getPosts(
      {
        type_: "All",
        limit: limit,
        page: page,
        community_name: MEET_UP_COMMUNITY_NAME,
        show_nsfw: true,
        sort: "New"
      }
    );
    postCollection = response.posts.slice();
  } catch (error) {
    console.error("Failed to fetch meet-up posts:", error);
  }
  finally {
    return postCollection;
  }
}


export async function getCurrentUserDetails(): Promise<MyUserInfo | undefined> {
  const response = await getClient().getSite();
  return response.my_user;

}

export async function hidePost(postId: number) {
  const response = await getClient().hidePost({
    post_ids: [postId],
    hide: true
  });
  return response.success;
}

export async function likePost(postId: number) {
  const response = await getClient().likePost(
    {
      post_id: postId,
      score: 1
    }
  );
  return response.post_view;
}

export async function likeComment(commentId: number) {
  const response = await getClient().likeComment(
    {
      comment_id: commentId,
      score: 1
    }
  );
  return response.comment_view;
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

export async function search(query: Search) {
  const response = await getClient().search(query)
  return response

}

export async function undoLikePost(postId: number) {
  const response = await getClient().likePost(
    {
      post_id: postId,
      score: 0
    }
  );
  return response.post_view;
}

export async function undoLikeComment(commentId: number) {
  const response = await getClient().likeComment(
    {
      comment_id: commentId,
      score: 0
    }
  );
  return response.comment_view;
}

// Referring https://github.com/LemmyNet/lemmy-js-client/blob/4eda61b6fd2b62d83e22616c14f540e4f57427c2/src/types/SaveUserSettings.ts#L1
export async function updateDisplayName(displayName: string) {
  const response = await getClient().saveUserSettings(
    {
      display_name: displayName
    }
  );
  return response.success
}

export async function changeUserPassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  previousJwt: string | undefined
): Promise<{ success: boolean; jwt?: string }> {
  try {
    const response = await getClient().changePassword({
      old_password: oldPassword,
      new_password: newPassword,
      new_password_verify: confirmPassword,
    });

    // Check the JWT from the response
    const newJwt = response.jwt;

    // Compare the new JWT with the previous JWT
    const success = newJwt != previousJwt;

    return {
      success,
      jwt: newJwt,
    };
  } catch (error) {
    console.error("Changing password failed:", error);
    return { success: false };
  }
}