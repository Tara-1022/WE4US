import React from 'react';
import { useState, useEffect } from 'react';
import LemmySearchBar from '../components/LemmySearchBar';
import { CommentView, CommunityView, PostView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import { Search as SearchIcon } from 'lucide-react';
import PaginationControls from '../components/PaginationControls';
import { DEFAULT_COMMUNITY_LIST_LIMIT } from '../constants';
import PostSnippet from '../components/PostSnippet';
import CommentSnippet from '../components/CommentSnippet';
import CommunitySnippet from '../components/CommunitySnippet';

let styles = {
  list: {
    listStyleType: "none",
    margin: 0,
    padding: 0
  },
  listItem: {

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

const SearchPage: React.FC = () => {
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

      }
    }
  )

  const searchDone = result != null
  const isResultPresent = (result && result.length > 0);

  const [page, setPage] = useState(1);
  const hasMore = (result && (result.length >= DEFAULT_COMMUNITY_LIST_LIMIT)) || false;

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
        setResult(
          [...response.posts
            .map(p => { return { type_: "post", data: p, id: p.post.id } as GenericView }),
          ...response.communities
            .map(c => { return { type_: "community", data: c, id: c.community.id } as GenericView }),
          ...response.comments
            .map(c => { return { type_: "comment", data: c, id: c.comment.id } as GenericView })
          ]
        );
        // searching among users would be redundant since we already 
        // search profiles in who's who
      })
  }, [lastQuery, page]);

  const list = filteredResult?.map(
    view => <li key={view.type_ + view.id} style={styles.listItem}>
      <GenericViewSnippet view={view} />
    </li>
  );

  return (
    <>
      <SearchIcon />
      <LemmySearchBar handleSearch={handleSearch} />

      {isResultPresent &&
        <ul style={styles.list}>{list}</ul>
      }

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