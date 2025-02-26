import {CommentView } from 'lemmy-js-client';
import CommentCreator from './CommentCreator';

// TODO: Add more information to the comment
export default function Comment({commentView, depth}:{commentView: CommentView, depth:number}){
    let styles ={
        container: {
            backgroundColor: "rgba(255,255,255,0.3)",
            marginLeft: 10*depth + "%",
            padding: "1%"
        }
    }

    return (
        <div style={styles.container}>
        <p>{commentView.comment.content} <br/>
        <b>{commentView.creator.display_name? commentView.creator.display_name: commentView.creator.name}</b>
        </p>
        <CommentCreator commentId={commentView.comment.id} actionName={"Reply"}/>
        </div>
    );
}