import { CommentView } from 'lemmy-js-client';
import { getComments } from '../library/LemmyApi';
import { useEffect, useState } from 'react';
import buildCommentsTree, { CommentNodeI } from '../library/CommentUtils';
import CommentsTree from './CommentsTree';
import CommentCreator from './CommentCreator';
import { CommentsContext, commentsContextValueType } from './CommentsContext';

export default function CommentsSection({ postId }: { postId: number }) {
    const [comments, setComments] = useState<CommentView[]>([]);
    let commentsTree: CommentNodeI[] = buildCommentsTree(comments);
    let commentsContextValue: commentsContextValueType = {
        comments: comments,
        setComments: setComments,
        postId: postId
    };

    useEffect(() => {
        getComments(postId).then(
            comments =>
                setComments(comments));
        commentsContextValue = { ...commentsContextValue, postId: postId };
        console.log("Fetched comments");
    },
        [postId]
    );

    useEffect(() => {
        commentsTree = buildCommentsTree(comments);
        commentsContextValue = { ...commentsContextValue, comments: comments }
    }, [comments])

    return (
        <CommentsContext.Provider value={commentsContextValue}>
            <CommentCreator actionName={"Comment"} />
            <CommentsTree commentsTree={commentsTree} />
        </CommentsContext.Provider>
    );
}