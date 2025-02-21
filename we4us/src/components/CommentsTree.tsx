import Comment from './Comment';
import { CommentNodeI } from '../library/CommentUtils';
import Collapsible from './Collapsible';
import CommentCreator from './CommentCreator';

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {

    }
}

export default function CommentsTree({commentsTree}:{commentsTree: CommentNodeI[]}) {
    const list = commentsTree.map(
        commentNode =>
        (
            <li key={commentNode.commentView.comment.id} style={styles.listItem}>
                <Collapsible>
                    <Comment commentView={commentNode.commentView} depth={commentNode.depth} />
                    <CommentCreator commentId={commentNode.commentView.comment.id} inCommentTree={true}/>
                    <CommentsTree commentsTree={commentNode.children}/>
                </Collapsible>
            </li>
        )
    );
    return <ul style={styles.list}>{list}</ul>;
}