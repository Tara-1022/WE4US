import React from 'react';
import { useState, useEffect } from 'react';
import LemmySearchBar from '../components/LemmySearchBar';
import { CommentView, CommunityView, PostView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import { Loader, Search as SearchIcon } from 'lucide-react';
import PostSnippet from '../components/PostSnippet';
import CommentSnippet from '../components/CommentSnippet';
import CommunitySnippet from '../components/CommunitySnippet';
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_POSTS_PER_PAGE } from '../constants';

let styles = {
  list: {
    listStyleType: "none",
    margin: 0,
    padding: 0
  }
}

type GenericView = {
  type_: "comment" | "community" | "post",
  data: CommentView | CommunityView | PostView,
  id: number
}

function GenericViewSnippet({ view }: { view: GenericView }) {
  switch (view.type_) {
    case "comment":
      return <CommentSnippet commentView={view.data as CommentView} withPostLink={true} />
    case "community":
      return <CommunitySnippet communityView={view.data as CommunityView} />
    case "post":
      return <PostSnippet postView={view.data as PostView} />
    default:
      return <></>
  }
}

const ReachingOutSearchPage: React.FC = () => {
  const [result, setResult] = useState<GenericView[] | null>(null);
  const [lastQuery, setLastQuery] = useState<Search | null>(null);
  const filteredResult = result?.filter(
    (view) => {
      switch (view.type_) {
        case "comment":
          const comment = view.data as CommentView;
          return !comment.post.deleted && !comment.comment.deleted && comment.post.nsfw != true;
        case "community":
          const community = view.data as CommunityView;
          return community.community.nsfw != true;
        case "post":
          const post = view.data as PostView;
          return post.post.nsfw != true && post.community.nsfw != true;
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
        limit: DEFAULT_POSTS_PER_PAGE,
      };

      search(queryWithPagination).then(
        (response) => {
          setResult(
            [...(result || []),
            ...response.posts
              .map(p => { return { type_: "post", data: p, id: p.post.id } as GenericView }),
            ...response.communities
              .map(c => { return { type_: "community", data: c, id: c.community.id } as GenericView }),
            ...response.comments
              .map(c => { return { type_: "comment", data: c, id: c.comment.id } as GenericView })
            ]
          );
          // searching among users would be redundant since we already 
          // search profiles in who's who
          setHasMore(
            (response.posts.length >= DEFAULT_POSTS_PER_PAGE) ||
            (response.comments.length >= DEFAULT_POSTS_PER_PAGE) ||
            (response.communities.length >= DEFAULT_POSTS_PER_PAGE) ||
            (response.users.length >= DEFAULT_POSTS_PER_PAGE)
            // We have to check users too, since the API returns this.
          );
        })
    }, [lastQuery, page]);

  const list = filteredResult?.map(
    view => <li key={view.type_ + view.id}>
      <GenericViewSnippet view={view} />
    </li>
  );

  return (
    <>
      <SearchIcon />
      <LemmySearchBar handleSearch={handleSearch} />

      {isResultPresent &&
        <div style={{ overflow: "auto" }} className='scrollableDiv'>
          <ul style={styles.list}>
            <InfiniteScroll
              dataLength={filteredResult?.length || 0}
              next={() => setPage(page + 1)}
              hasMore={hasMore}
              loader={<Loader />}
              endMessage={<h4 style={{ textAlign: 'center' }}>That's all, folks!</h4>}
              scrollableTarget="scrollableDiv">
              {list}
            </InfiniteScroll>
          </ul>
        </div>
      }

      {searchDone && !isResultPresent && <h3>No Results Found</h3>}

    </>
  );
};

export default ReachingOutSearchPage;