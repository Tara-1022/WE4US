import { Plus } from "lucide-react";
import { likeComment, likePost, undoLikeComment, undoLikePost } from "../library/LemmyApi";
import { useState } from "react";

let iconStyle = {
    cursor: "pointer"
}

export default function LikeHandler({ forPost, isInitiallyLiked, id, initialLikes }:
    { forPost: boolean, isInitiallyLiked: boolean, id: number, initialLikes: number }) {
    const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
    const [likes, setLikes] = useState<number>(initialLikes);
    const likeAdder = forPost ? likePost : likeComment;
    const likeRemover = forPost ? undoLikePost : undoLikeComment;

    function handleClick(event: React.MouseEvent<SVGSVGElement>) {
        event.preventDefault();
        const task = isLiked ? likeRemover : likeAdder;
        console.log(task);
        task(id).then(
            (_response) => {
                setLikes(isLiked? likes-1: likes+1)
                setIsLiked(!isLiked);
                console.log(isLiked)
            }
        )
    }

    return (
        // TODO: replace hardcoded colors by pulling from themes
        <>
        {likes}
        <Plus onClick={handleClick} style={iconStyle} color={isLiked? "#f46801": "#ffffff"}/>
        </>
    )
}