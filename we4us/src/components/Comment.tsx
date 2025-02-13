import {CommentView } from 'lemmy-js-client';

export default function Comment({commentView}:{commentView: CommentView}){
    console.log(commentView);
    return (
        <>
        <p>{commentView.comment.content}</p>
        <p>{commentView.creator.display_name? commentView.creator.display_name: commentView.creator.name}</p>
        </>
    );
}