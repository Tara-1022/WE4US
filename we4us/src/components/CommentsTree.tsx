import {CommentView } from 'lemmy-js-client';
import Comment from './Comment';
import { getComments } from '../library/LemmyApi';
import { useEffect, useState } from 'react';

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {

    }
}
// https://github.com/LemmyNet/lemmy-ui/blob/main/src/shared/utils/app/build-comments-tree.ts#L1
export default function CommentsTree({postId}: {postId: number}){
    const [comments, setComments] = useState<CommentView[]>([]);
    useEffect( () =>{
        getComments(postId).then(
            comments =>
            setComments(comments));
            console.log("Fetched comments");
    },
        [postId]
    );
    const list = comments.map(
                commentView => <li key={commentView.comment.id} style={styles.listItem}>
                    <Comment commentView={commentView} />
                            </li>
            );
            return <ul style={styles.list}>{list}</ul>;
}