import { SearchType, Search } from "lemmy-js-client"
import CommunitySelector from "./CommunitySelector";

export default function LemmySearchBar({ handleSearch, communityName }:
    { handleSearch: (result: Search) => void, communityName?: string }) {

    function passParamsOut(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { query, communityId, type, checkOnlyPostTitles } = Object.fromEntries(formData);
        handleSearch(
            {
                q: query.toString(),
                ...(communityName ?
                    { community_name: communityName }
                    : communityId && { community_id: Number(communityId) }),
                ...(type && { type_: type.toString() as SearchType }),
                ...(checkOnlyPostTitles && { post_title_only: true })
            });
    }
    return (
        <form onSubmit={passParamsOut}>
            <input name="query" placeholder="Search query" />
            <label htmlFor="type">Type</label>
            <select name="type">
                <option value="All">All</option>
                <option value="Comments">Comments</option>
                <option value="Posts">Posts</option>
                {
                    communityName ||
                    <option value="Communities">Communities</option>
                }
            </select>
            {
                communityName ? <></>
                    :
                    <>
                        <label htmlFor="communityId">Within community</label>
                        <CommunitySelector name="communityId" />
                    </>
            }
            <label htmlFor="checkOnlyPostTitles">Check only titles?</label>
            <input type="checkbox" name="checkOnlyPostTitles" />
            <button type="submit">Search</button>
        </form>
    )
}