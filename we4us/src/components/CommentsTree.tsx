import Comment from './Comment';
import { CommentNodeI } from '../library/CommentUtils';

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {

    }
}

export default function CommentsTree({commentsTree}: {commentsTree:  CommentNodeI[]}){
    const list = commentsTree.map(
                commentNode => <li key={commentNode.commentView.comment.id} style={styles.listItem}>
                    <Comment commentView={commentNode.commentView} depth={commentNode.depth}/>
                    <CommentsTree commentsTree={commentNode.children} />
                            </li>
            );
    return <ul style={styles.list}>{list}</ul>;
}