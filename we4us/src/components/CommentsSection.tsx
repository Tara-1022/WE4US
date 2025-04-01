import { CommentView } from 'lemmy-js-client';
import { getComments } from '../library/LemmyApi';
import { useEffect, useState } from 'react';
import buildCommentsTree, { CommentNodeI } from '../library/CommentUtils';
import CommentsTree from './CommentsTree';
import CommentCreator from './CommentCreator';
import { CommentsContext, commentsContextValueType } from './CommentsContext';
import { Loader } from 'lucide-react';
import { DEFAULT_COMMENTS_LIMIT } from '../constants';

export default function CommentsSection({ postId }: { postId: number }) {
    const [comments, setComments] = useState<CommentView[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    let commentsTree: CommentNodeI[] = buildCommentsTree(comments);
    let commentsContextValue: commentsContextValueType = {
        comments: comments,
        setComments: setComments,
        postId: postId
    };

    useEffect(() => {
        getComments({ postId: postId }).then(
            (comments) => {
                setComments(comments);
                if (comments.length < DEFAULT_COMMENTS_LIMIT) setHasMore(false);
            });
        commentsContextValue = { ...commentsContextValue, postId: postId };
        console.log("Fetched comments");
    },
        [postId]
    );

    useEffect(() => {
        commentsTree = buildCommentsTree(comments);
        commentsContextValue = { ...commentsContextValue, comments: comments }
    }, [comments])

    async function getMoreComments() {
        if (!hasMore) return;
        setIsLoading(true);
        const newComments = await getComments({ postId: postId, page: page });
        setComments((comments) => [...comments, ...newComments]);
        if (newComments.length < DEFAULT_COMMENTS_LIMIT) {
            setHasMore(false);
        }
        else {
            setHasMore(true);
            setPage(p => p + 1);
        }
        setIsLoading(false);
        console.log("Fetched more. comments are now ", comments.length)
    }

    return (
        <CommentsContext.Provider value={commentsContextValue}>
            <CommentCreator actionName={"Comment"} />
            <CommentsTree commentsTree={commentsTree} />
            {hasMore &&
                <button onClick={getMoreComments}>Load more</button>}
            {loading && <Loader />}
        </CommentsContext.Provider>
    );
}