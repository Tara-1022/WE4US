import { SearchType, Search } from "lemmy-js-client"
import CommunitySelector from "./CommunitySelector";
import { Search as SearchIcon } from "lucide-react";
import "../styles/LemmySearchBar.css"

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
        <form onSubmit={passParamsOut} className="search-bar">
            <SearchIcon className="search-icon" />
            <input name="query" placeholder="Search query" className="search-input" />
            <div className="filters">
                <div className="field">
                    <label htmlFor="type">Type:</label>
                    <select name="type" >
                        <option value="All">All</option>
                        <option value="Comments">Comments</option>
                        <option value="Posts">Posts</option>
                        {
                            communityName ||
                            <option value="Communities">Communities</option>
                        }
                    </select>
                </div>

                {
                    communityName ? <></>
                        :
                        <div className="field">
                            <label htmlFor="communityId">Within community:</label>
                            <CommunitySelector name="communityId" />
                        </div>
                }

                <div className="field">
                    <label htmlFor="checkOnlyPostTitles">Search only titles?</label>
                    <input type="checkbox" name="checkOnlyPostTitles" />
                </div>
            </div>

            <button type="submit" className="search-button">Search</button>
        </form>
    )
}