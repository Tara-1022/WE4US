import React from 'react';
import { useState, useEffect } from 'react';
import LemmySearchBar from '../components/LemmySearchBar';
import { CommentView, CommunityView, PostView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Search as SearchIcon } from 'lucide-react';
import CommunityList from '../components/CommunityList';
import CommentList from '../components/CommentList';
import PaginationControls from '../components/PaginationControls';
import { DEFAULT_COMMUNITY_LIST_LIMIT } from '../constants';

const SearchPage: React.FC = () => {
  const [postResult, setPostResult] = useState<PostView[] | null>(null);
  const [communityResult, setCommunityResult] = useState<CommunityView[] | null>(null);
  const [commentResult, setCommentResult] = useState<CommentView[] | null>(null);
  const [lastQuery, setLastQuery] = useState<Search | null>(null);

  const [page, setPage] = useState(1);

  const searchDone = (postResult || commentResult || communityResult)
  const isResultPresent = (postResult && postResult.length > 0)
    || (commentResult && commentResult.length > 0)
    || (communityResult && communityResult.length > 0)

  function handleSearch(queryParams: Search) {
    setPage(1);
    setLastQuery(queryParams);
  }

  useEffect(() => {
    if (!lastQuery) return;

    const queryWithPagination = {
      ...lastQuery,
      page,
      limit: DEFAULT_COMMUNITY_LIST_LIMIT,
    };

    search(queryWithPagination).then(
        (response) => {
        console.log("Response: ", response);
                // No need to filter posts since our deletion logic automatically
                // hides them from search results
      setPostResult(response.posts);
      setCommunityResult(response.communities);
      setCommentResult(response.comments
        ?.filter(c => !c.post.deleted && !c.comment.deleted) ?? []
                        // searching among users would be redundant since we already 
                // search profiles in who's who
      )
    })
  }, [lastQuery, page]);

  const hasMore = (
    (postResult?.length === DEFAULT_COMMUNITY_LIST_LIMIT) ||
    (communityResult?.length === DEFAULT_COMMUNITY_LIST_LIMIT) ||
    (commentResult?.length === DEFAULT_COMMUNITY_LIST_LIMIT)
  );
  

  return (
    <>
      <SearchIcon />
      <LemmySearchBar handleSearch={handleSearch} />
      {postResult && postResult.length > 0 && (
        <div>
          <h2>Posts</h2>
          <PostList postViews={postResult} />
        </div>)}
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
      {searchDone && !isResultPresent && <h3>No Results Found</h3>}

      {searchDone && isResultPresent && (
        <PaginationControls
          page={page}
          setPage={setPage}
          hasMore={hasMore}
        />
      )}
    </>
  );
};

export default SearchPage;