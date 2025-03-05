import React from 'react';
import { useState } from 'react'
import LemmySearchBar from '../components/LemmySearchBar';
import { CommentView, CommunityView, PostView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Search as SearchIcon } from 'lucide-react';
import CommunityList from '../components/CommunityList';
import CommentList from '../components/CommentList';

const SearchPage: React.FC = () => {
    const [postResult, setPostResult] = useState<PostView[] | null>(null);
    const [communityResult, setCommunityResult] = useState<CommunityView[] | null>(null);
    const [commentResult, setCommentResult] = useState<CommentView[] | null>(null);

    function handleSearch(queryParams: Search) {
        console.log("Query: ", queryParams)
        search(queryParams).then(
            (response) => {
                console.log("Response: ", response);
                // No need to filter posts since our deletion logic automatically
                // hides them from search results
                setPostResult(response.posts);
                setCommunityResult(response.communities);
                setCommentResult(response.comments
                    .filter(commentView => { return !commentView.post.deleted && !commentView.comment.deleted; }));
                // searching among users would be redundant since we already 
                // search profiles in who's who
            }
        )
    }

    return (
        <>
            <SearchIcon />
            <LemmySearchBar handleSearch={handleSearch} />
            {postResult && postResult.length > 0 &&
                <div>
                    <h2>Posts</h2>
                    <PostList postViews={postResult} />
                </div>}
            {communityResult && communityResult.length > 0 &&
                (<div>
                    <h2>Communities</h2>
                    <CommunityList communityViews={communityResult} />
                </div>)}
            {commentResult && commentResult.length > 0 &&
                (<div>
                    <h2>Comments</h2>
                    <CommentList commentViews={commentResult} />
                </div>)}
        </>
    )
}

export default SearchPage;