import { LemmyHttp } from "lemmy-js-client";
import { INSTANCE_URL } from "./constants";
import { PostView } from 'lemmy-js-client';

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