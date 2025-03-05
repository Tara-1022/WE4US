import React from 'react';
import { useState } from 'react'
import LemmySearchBar from '../components/LemmySearchBar';
import { CommunityView, PostView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Search as SearchIcon } from 'lucide-react';
import CommunityList from '../components/CommunityList';

const SearchPage: React.FC = () => {
    const [postResult, setPostResult] = useState<PostView[] | null>(null);
    const [communityResult, setCommunityResult] = useState<CommunityView[] | null>(null);

    function handleSearch(queryParams: Search) {
        console.log("Query: ", queryParams)
        search(queryParams).then(
            (response) => {
                console.log("Response: ", response);
                setPostResult(response.posts);
                setCommunityResult(response.communities);
                // also available: comments, users
                // searching among users would be redundant since we already 
                // search profiles in who's who
            }
        )
    }

    return (
        <>
            <SearchIcon />
            <LemmySearchBar handleSearch={handleSearch} />
            {postResult &&
                <div>
                    <h2>Posts</h2>
                    <PostList postViews={postResult} />
                </div>}
            {communityResult &&
                <div>
                    <h2>Communities</h2>
                    <CommunityList communityViews={communityResult} />
                </div>}
        </>
    )
}

export default SearchPage;