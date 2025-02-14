import {CommentView } from 'lemmy-js-client';
import { getComments } from '../library/LemmyApi';
import { useEffect, useState } from 'react';
import buildCommentsTree from '../library/CommentUtils';
import CommentsTree from './CommentsTree';

export default function CommentsSection({postId}: {postId: number}){
    const [comments, setComments] = useState<CommentView[]>([]);
    useEffect( () =>{
        getComments(postId).then(
            comments =>
            setComments(comments));
            console.log("Fetched comments");
    },
        [postId]
    );
    const commentsTree = buildCommentsTree(comments);
    return (
        <CommentsTree commentsTree={commentsTree} />
    );
}