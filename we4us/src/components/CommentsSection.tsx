import { CommentView } from 'lemmy-js-client';
import { getComments } from '../library/LemmyApi';
import { useEffect, useState } from 'react';
import buildCommentsTree, { getDepthFromComment, CommentNodeI } from '../library/CommentUtils';
import CommentsTree from './CommentsTree';
import CommentCreator from './CommentCreator';
import { CommentsContext, commentsContextValueType } from './CommentsContext';
import { Loader } from 'lucide-react';
import { DEFAULT_COMMENTS_LIMIT, DEFAULT_COMMENTS_DEPTH } from '../constants';
import InfiniteScroll from "react-infinite-scroll-component";

export default function CommentsSection({ postId }: { postId: number }) {
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState<CommentView[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const baseCommentsLoaded = comments
        .filter(
            (comment) => getDepthFromComment(comment.comment) < DEFAULT_COMMENTS_DEPTH
        )

    let commentsTree: CommentNodeI[] = buildCommentsTree(comments);
    let commentsContextValue: commentsContextValueType = {
        comments: comments,
        setComments: setComments,
        postId: postId
    };

    useEffect(() => {
        getComments({ postId: postId }).then(
            comments => {
                setComments(comments)
                if (comments.length < DEFAULT_COMMENTS_LIMIT) setHasMore(false);
            });
        commentsContextValue = { ...commentsContextValue, postId: postId };
    },
        [postId]
    );

    useEffect(() => {
        commentsTree = buildCommentsTree(comments);
        commentsContextValue = { ...commentsContextValue, comments: comments }
    }, [comments])

    async function getMoreComments() {
        if (!hasMore) return;

        const initialLength = comments.length;
        const newComments = await getComments({ postId: postId, page: page + 1 });

        setComments((comments) => [...comments, ...newComments]);

        if (comments.length == initialLength) {
            setHasMore(false);
        }
        else {
            setHasMore(true);
            setPage(p => p + 1);
        }
        console.log("Fetched more. comments are now ", baseCommentsLoaded.length)
    }

    return (
        <CommentsContext.Provider value={commentsContextValue}>
            <CommentCreator actionName={"Comment"} />
            <div style={{ overflow: "auto" }} className='scrollableDiv'>
                <InfiniteScroll
                    // since we don't want to count replies here
                    dataLength={baseCommentsLoaded.length}
                    next={getMoreComments}
                    hasMore={hasMore}
                    loader={<Loader />}
                    endMessage={<h4>That's all, folks!</h4>}
                    scrollableTarget="scrollableDiv"
                >
                    <CommentsTree commentsTree={commentsTree} />
                </InfiniteScroll>
            </div>
        </CommentsContext.Provider>
    );
}