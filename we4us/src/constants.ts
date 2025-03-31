export const LEMMY_INSTANCE_URL = "http://localhost:10633";
export const LEMMY_IMAGE_URL = LEMMY_INSTANCE_URL + "/pictrs/image/"

export const POSTGRES_API_BASE_URL = "http://localhost:4000/api/";
export const POSTGRES_PROFILES_ENDPOINT = "profiles/";

export const DEFAULT_POSTS_PER_PAGE = 10;
// From what can be seen, the limit of comments fetch is 300 per page. setting it to this for now.
export const DEFAULT_COMMENTS_LIMIT = 300;
export const DEFAULT_COMMENTS_DEPTH = 1;