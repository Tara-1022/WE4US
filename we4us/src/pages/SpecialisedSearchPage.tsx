import React from 'react';
import { useState, useEffect } from 'react';
import LemmySearchBar from '../components/LemmySearchBar';
import { CommentView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_POSTS_PER_PAGE, isSpecialCommunity } from '../constants';
import { commentToGenericView, GenericView, GenericViewList, postToGenericView } from '../library/GenericView';
import RedirectPage from './RedirectPage';

const SpecialisedSearchPage: React.FC<{ community: string }> = ({ community }) => {
  if (community && !(isSpecialCommunity(community))) {
    return <RedirectPage />
  }

  const [result, setResult] = useState<GenericView[] | null>(null);
  const [lastQuery, setLastQuery] = useState<Search | null>(null);
  const filteredResult = result?.filter(
    (view) => {
      switch (view.type_) {
        case "comment":
          const comment = view.data as CommentView;
          return !comment.post.deleted && !comment.comment.deleted;
        case "post":
          return true;
        // No need to filter deleted posts since our logic automatically
        // hides them from search results
      }
    }
  )

  const searchDone = result != null
  const isResultPresent = (result && result.length > 0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  function handleSearch(queryParams: Search) {
    setPage(1);
    setLastQuery(queryParams);
    // we need to erase previous renders
    setResult(null);
  }

  useEffect(
    () => {
      if (!lastQuery) return;

      const queryWithPagination = {
        ...lastQuery,
        page,
        limit: DEFAULT_POSTS_PER_PAGE
      };

      search(queryWithPagination).then(
        (response) => {
          setResult(
            [...(result || []),
            ...response.posts.map(p => postToGenericView(p)),
            ...response.comments.map(c => commentToGenericView(c))
            ]
          );
          // searching among users would be redundant since we already 
          // search profiles in who's who
          setHasMore(
            (response.posts.length >= DEFAULT_POSTS_PER_PAGE) ||
            (response.comments.length >= DEFAULT_POSTS_PER_PAGE) ||
            (response.communities.length >= DEFAULT_POSTS_PER_PAGE) ||
            (response.users.length >= DEFAULT_POSTS_PER_PAGE)
            // We have to check communities and users too, since the API returns this.
          );
          console.log(filteredResult)
        })
    }, [lastQuery, page]);

  return (
    <>
      <LemmySearchBar handleSearch={handleSearch} communityName={community} />

      {isResultPresent && filteredResult &&
        <div style={{ overflow: "auto" }} className='scrollableDiv'>
          <InfiniteScroll
            dataLength={filteredResult?.length || 0}
            next={() => setPage(page + 1)}
            hasMore={hasMore}
            loader={<Loader />}
            endMessage={<h4 style={{ textAlign: 'center' }}>That's all, folks!</h4>}
            scrollableTarget="scrollableDiv">
            <GenericViewList views={filteredResult} />
          </InfiniteScroll>
        </div>
      }

      {searchDone && !isResultPresent && <h3>No Results Found</h3>}

    </>
  );
};

export default SpecialisedSearchPage;
