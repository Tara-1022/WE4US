import React from 'react';
import { useState } from 'react'
import LemmySearchBar from '../components/LemmySearchBar';
import { PostView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage: React.FC = () => {
    const [postResult, setPostResult] = useState<PostView[] | null>(null)
    
    function handleSearch(queryParams: Search) {
        console.log("Query: ", queryParams)
        search(queryParams).then(
            (response) => {
                console.log("Response: ", response);
                setPostResult(response.posts);
            }
        )
    }

    return (
        <>
        <SearchIcon />
        <LemmySearchBar handleSearch={handleSearch} />
        {postResult && <PostList postViews={postResult} />}
        </>
    )
}

export default SearchPage;