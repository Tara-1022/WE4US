import { LemmyHttp } from "lemmy-js-client";
import { INSTANCE_URL } from "../constants";
import { PostView } from 'lemmy-js-client';

export async function getPostById(postId: number){
  // TODO: Use a common client object to reduce waste
  const client = new LemmyHttp(INSTANCE_URL);
  try{
    return client.getPost(
      {
        id: postId
      }
      );
  }
  catch (error) {
    console.error(error);
  }
}

export async function getPostList(){
    const client = new LemmyHttp(INSTANCE_URL);
    let postCollection: PostView[] = [];
    try{
        const response = await client.getPosts(
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