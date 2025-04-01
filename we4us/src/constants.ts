export const LEMMY_INSTANCE_URL = "http://localhost:10633";
export const LEMMY_IMAGE_URL = LEMMY_INSTANCE_URL + "/pictrs/image/"

export const POSTGRES_API_BASE_URL = "http://localhost:4000/api/";
export const POSTGRES_PROFILES_ENDPOINT = "profiles/";

export const DEFAULT_POSTS_PER_PAGE = 10;
// From what can be seen, the limit of comments fetch seems to be 300 per page.
// Keeping it lower so the infinite scroll attempts to fetch commits atleast once.
// Essentially, attempt paging until we get less than 20 new comments
// This shouldn't cause issues and should enable infinite scrolling to work regardless of 
// what the actual returned number is.
export const DEFAULT_COMMENTS_LIMIT = 20;
export const DEFAULT_COMMENTS_DEPTH = 1;