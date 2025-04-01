import Comment from './Comment';
import { CommentNodeI } from '../library/CommentUtils';
import Collapsible from './Collapsible';
import { useEffect, useState } from 'react';
import { getComments } from '../library/LemmyApi';
import { useCommentsContext } from './CommentsContext';
import { DEFAULT_COMMENTS_LIMIT } from '../constants';

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {

    },
    clickableText: {
        cursor: "pointer"
    }
}

function RootAndReplies({ commentNode }: { commentNode: CommentNodeI }) {
    const [viewReplies, setViewReplies] = useState<boolean>(false);
    // Page 0 to indicate replies have not been loaded
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { setComments } = useCommentsContext();

    function fetchMore() {
        if (!hasMore) return;

        getComments({ parentId: commentNode.commentView.comment.id, maxDepth: 1, page: page + 1 })
            .then(
                (newComments) => {
                    newComments = newComments.filter(
                        (comment) => comment.comment.id != commentNode.commentView.comment.id
                    )
                    setComments((prevComments) => [...prevComments, ...newComments]);
                    setPage(p => p + 1);
                    if (newComments.length < DEFAULT_COMMENTS_LIMIT) setHasMore(false);
                }
            )
    }

    useEffect(
        () => {
            if (viewReplies && (page == 0)) {
                fetchMore();
            }
        }, [viewReplies]
    )

    function handleMore(event: React.MouseEvent<HTMLSpanElement>) {
        event.preventDefault();
        fetchMore();
    }

    return (
        <>
            <Comment commentView={commentNode.commentView} depth={commentNode.depth} />
            {commentNode.commentView.counts.child_count > 0 &&
                <>
                    <span onClick={() => setViewReplies(!viewReplies)} style={styles.clickableText}>
                        {viewReplies ? "Hide replies" : "Show Replies"}
                    </span>
                    {viewReplies &&
                        <Collapsible>
                            <CommentsTree commentsTree={commentNode.children} />
                        </Collapsible>
                    }

                    {hasMore && viewReplies &&
                        <span onClick={handleMore} style={styles.clickableText}>
                            Show more replies
                        </span>}
                </>
            }
        </>
    )
}

// https://github.com/LemmyNet/lemmy-ui/blob/129fb5b2f994e02bfecc36e3f6884bdbf485b87a/src/shared/components/post/post.tsx#L868
export default function CommentsTree({ commentsTree }: { commentsTree: CommentNodeI[] }) {
    const list = commentsTree.map(
        commentNode =>
        (
            <li key={commentNode.commentView.comment.id} style={styles.listItem}>
                <RootAndReplies commentNode={commentNode} />
            </li>
        )
    );
    return <ul style={styles.list}>{list}</ul>;
}