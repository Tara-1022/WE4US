import Comment from './Comment';
import { CommentNodeI } from '../library/CommentUtils';
import Collapsible from '../library/Collapsible';

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {},
    clickableText: {
        cursor: "pointer"
    }
}

function OpenText() { return <span style={styles.clickableText}>Show Replies</span> }
function ClosedText() { return <span style={styles.clickableText}>Hide Replies</span> }

export default function CommentsTree({ commentsTree }: { commentsTree: CommentNodeI[] }) {
    const list = commentsTree.map(
        commentNode =>
        (
            <li key={commentNode.commentView.comment.id} style={styles.listItem}>
                <Comment commentView={commentNode.commentView} depth={commentNode.depth} />
                {commentNode.commentView.counts.child_count > 0 &&
                    <Collapsible
                        OpenIcon={OpenText}
                        CollapsedIcon={ClosedText}
                        initiallyExpanded={false}
                        style={{ marginLeft: 10 * commentNode.depth + "%" }}
                    >
                        <CommentsTree commentsTree={commentNode.children} />
                    </Collapsible>
                }
            </li>
        )
    );
    return <ul style={styles.list}>{list}</ul>;
}