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

export default function CommentsTree({commentsTree, postId} :{commentsTree: CommentNodeI[], postId: number}) {
    const list = commentsTree.map(
        commentNode =>
        (
            <li key={commentNode.commentView.comment.id} style={styles.listItem}>
                <Collapsible>
                    <Comment commentView={commentNode.commentView} depth={commentNode.depth} />
                    <CommentCreator postId={postId} commentId={commentNode.commentView.comment.id}/>
                    <CommentsTree commentsTree={commentNode.children} postId={postId}/>
                </Collapsible>
            </li>
        )
    );
    return <ul style={styles.list}>{list}</ul>;
}