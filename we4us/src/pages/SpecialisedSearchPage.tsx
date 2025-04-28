import React from 'react';
import { useState, useEffect } from 'react';
import LemmySearchBar from '../components/LemmySearchBar';
import { CommentView, PostView, Search } from 'lemmy-js-client';
import { search } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import AnnouncementPostSnippet from '../components/Announcements/AnnouncementPostSnippet';
import MeetUpPostSnippet from '../components/MeetUp/MeetUpSnippet';
import PgPostSnippet from '../components/PgFinder/PgPostSnippet';
import JobPostSnippet from '../components/JobBoard/JobPostSnippet';
import CommentSnippet from '../components/CommentSnippet';
import InfiniteScroll from "react-infinite-scroll-component";
import { ANNOUNCEMENTS_COMMUNITY_NAME, DEFAULT_POSTS_PER_PAGE, JOB_BOARD_COMMUNITY_NAME, MEET_UP_COMMUNITY_NAME, PG_FINDER_COMMUNITY_NAME } from '../constants';
import RedirectPage from './RedirectPage';

let styles = {
  list: {
    listStyleType: "none",
    margin: 0,
    padding: 0
  }
}

type GenericView = {
  type_: "comment" | "post",
  data: CommentView | PostView,
  id: number
}

function GenericViewSnippet({ view, community }: { view: GenericView, community: string }) {
  switch (view.type_) {
    case "comment":
      return <CommentSnippet commentView={view.data as CommentView} withPostLink={true} />
    case "post":
      const postView = view.data as PostView;
      switch (community) {
        case ANNOUNCEMENTS_COMMUNITY_NAME:
          return <AnnouncementPostSnippet postView={postView} />
        case MEET_UP_COMMUNITY_NAME:
          return <MeetUpPostSnippet postView={postView} />
        case PG_FINDER_COMMUNITY_NAME:
          return <PgPostSnippet postView={postView} />
        case JOB_BOARD_COMMUNITY_NAME:
          return <JobPostSnippet postView={postView} />
        default:
          return <></>
      }
    default:
      return <></>
  }
}

const SpecialisedSearchPage: React.FC<{ community: string }> = ({ community }) => {
  if (community &&
    !([ANNOUNCEMENTS_COMMUNITY_NAME,
      MEET_UP_COMMUNITY_NAME,
      PG_FINDER_COMMUNITY_NAME,
      JOB_BOARD_COMMUNITY_NAME].some(
        (name) => name == community
      ))) {
    console.log(community == ANNOUNCEMENTS_COMMUNITY_NAME)
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
            ...response.posts
              .map(p => { return { type_: "post", data: p, id: p.post.id } as GenericView }),
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
            // We have to check communities and users too, since the API returns this.
          );
          console.log(filteredResult)
        })
    }, [lastQuery, page]);

  const list = filteredResult?.map(
    view => <li key={view.type_ + view.id}>
      <GenericViewSnippet view={view} community={community} />
    </li>
  );

  return (
    <>
      <LemmySearchBar handleSearch={handleSearch} communityName={community} />

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

export default SpecialisedSearchPage;