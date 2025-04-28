import Comment from './Comment';
import { CommentNodeI } from '../library/CommentUtils';
import Collapsible from './Collapsible';
import { useEffect, useState } from 'react';
import { getComments } from '../library/LemmyApi';
import { useCommentsContext } from './CommentsContext';

function RootAndReplies({ commentNode }: { commentNode: CommentNodeI }) {
    const [viewReplies, setViewReplies] = useState<boolean>(false);
    const [repliesLoaded, setRepliesLoaded] = useState<boolean>(
        commentNode.commentView.counts.child_count == 0 ||
        (commentNode.commentView.counts.child_count > 0
            && commentNode.children.length > 0
        )
    );
    const { setComments } = useCommentsContext();
    
    const styles = {
        repliesButton: {
            fontSize: "13px",
            color: "#a0a8b0",
            background: "#252830",
            border: "none",
            padding: "4px 8px",
            cursor: "pointer",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            margin: "0 0 8px 16px"
        },
        repliesContainer: {
            marginTop: "4px"
        }
    };

    useEffect(
        () => {
            if (viewReplies && !repliesLoaded) fetchReplies();
        }, [viewReplies]
    )

    function fetchReplies() {
        console.log("Fetching more")
        getComments({ parentId: commentNode.commentView.comment.id })
            .then(
                (newComments) => {
                    newComments = newComments.filter(
                        (comment) => comment.comment.id != commentNode.commentView.comment.id
                    )
                    setComments((prevComments) => [...prevComments, ...newComments]);
                    setRepliesLoaded(true);
                }
            )
    }

    return (
        <>
            <Comment commentView={commentNode.commentView} depth={commentNode.depth} />
            {commentNode.commentView.counts.child_count > 0 &&
                <div style={styles.repliesContainer}>
                    <Collapsible
                        initiallyExpanded={false}
                        onToggle={() => setViewReplies(!viewReplies)}
                        CollapsedIcon={() => <span style={styles.repliesButton}>Show Replies</span>}
                        OpenIcon={() => <span style={styles.repliesButton}>Hide Replies</span>}
                    >
                        <CommentsTree commentsTree={commentNode.children} />
                    </Collapsible>
                </div>
            }
        </>
    )
}

// https://github.com/LemmyNet/lemmy-ui/blob/129fb5b2f994e02bfecc36e3f6884bdbf485b87a/src/shared/components/post/post.tsx#L868
export default function CommentsTree({ commentsTree }: { commentsTree: CommentNodeI[] }) {
    const styles = {
        list: {
            listStyleType: "none",
            margin: 0,
            padding: 0
        }
    };
    
    const list = commentsTree.map(
        commentNode =>
        (
            <li key={commentNode.commentView.comment.id}>
                <RootAndReplies commentNode={commentNode} />
            </li>
        )
    );
    return <ul style={styles.list}>{list}</ul>;
}