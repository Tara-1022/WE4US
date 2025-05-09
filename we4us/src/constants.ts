export const LEMMY_INSTANCE_URL = "http://localhost:10633";
export const LEMMY_IMAGE_URL = LEMMY_INSTANCE_URL + "/pictrs/image/"

export const POSTGRES_API_BASE_URL = "http://localhost:4000/api/";
export const POSTGRES_PROFILES_ENDPOINT = "profiles/";

export const DEFAULT_POSTS_PER_PAGE = 10;
export const DEFAULT_COMMUNITY_LIST_LIMIT = 15;
export const DEFAULT_COMMENTS_DEPTH = 3;

export const MILLISECONDS_IN_AN_HOUR = 1000 * 60 * 60;
export const SESSION_DURATION = 1000 * 60 * 60 * 24 * 14; //14 days
export const WARNING_INTERVAL = 1000 * 60 * 5; // 5 minutes
export const MAX_WARNINGS = 3;

export const JOB_BOARD_COMMUNITY_NAME = "job_board";
export const MEET_UP_COMMUNITY_NAME = "meet_up";
export const PG_FINDER_COMMUNITY_NAME = "pg_finder";
export const ANNOUNCEMENTS_COMMUNITY_NAME = "announcements";
export function isSpecialCommunity(communityName: string) {
    return [ANNOUNCEMENTS_COMMUNITY_NAME,
        MEET_UP_COMMUNITY_NAME,
        PG_FINDER_COMMUNITY_NAME,
        JOB_BOARD_COMMUNITY_NAME].some(
            (name) => name == communityName
        )
}
export function getCommunityPath(communityName: string) {
    switch (communityName) {
        case ANNOUNCEMENTS_COMMUNITY_NAME:
            return "announcements"
        case JOB_BOARD_COMMUNITY_NAME:
            return "job-board"
        case PG_FINDER_COMMUNITY_NAME:
            return "pg-finder"
        case MEET_UP_COMMUNITY_NAME:
            return "meetup"
        default:
            return null
    }
}