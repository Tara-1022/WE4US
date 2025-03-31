import Comment from './Comment';
import { CommentNodeI } from '../library/CommentUtils';
import Collapsible from './Collapsible';
import { useState } from 'react';
import { getComments } from '../library/LemmyApi';
import { useCommentsContext } from './CommentsContext';

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {

    },
    repliesText: {
        cursor: "pointer"
    }
}

function RootAndReplies({ commentNode }: { commentNode: CommentNodeI }) {
    const [viewReplies, setViewReplies] = useState<boolean>(false);
    const [isRepliesLoaded, setRepliesLoaded] = useState<boolean>(false);
    const { setComments } = useCommentsContext();

    function handleClick(event: React.MouseEvent<HTMLSpanElement>) {
        event.preventDefault();
        setViewReplies(!viewReplies);
        if (!isRepliesLoaded) {
            getComments({ parentId: commentNode.commentView.comment.id, maxDepth: 1 }).then(
                (newComments) => {
                    newComments = newComments.filter(
                        (comment) => comment.comment.id != commentNode.commentView.comment.id
                    )
                    setComments((prevComments) => [...prevComments, ...newComments]);
                    setRepliesLoaded(true);
                }
            )
        }
    }

    return (
        <>
            <Comment commentView={commentNode.commentView} depth={commentNode.depth} />
            {commentNode.commentView.counts.child_count > 0 &&
                <>
                    <span onClick={handleClick} >
                        {viewReplies ? "Hide replies" : "Show Replies"}
                    </span>
                    {viewReplies && isRepliesLoaded &&
                        <Collapsible>
                            <CommentsTree commentsTree={commentNode.children} />
                        </Collapsible>
                    }
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