import { Plus } from "lucide-react";
import { likeComment, likePost, undoLikeComment, undoLikePost } from "../library/LemmyApi";
import { useState } from "react";

let iconStyle = {
    cursor: "pointer"
}

export default function LikeHandler({ forPost, isInitiallyLiked, id }:
    { forPost: boolean, isInitiallyLiked: boolean, id: number }) {
    const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
    const likeAdder = forPost ? likePost : likeComment;
    const likeRemover = forPost ? undoLikePost : undoLikeComment;

    function handleClick(event: React.MouseEvent<SVGSVGElement>) {
        event.preventDefault();
        const task = isLiked ? likeRemover : likeAdder;
        console.log(task);
        task(id).then(
            (_response) => {
                setIsLiked(!isLiked);
                console.log(isLiked)
            }
        )
    }

    return (
        // TODO: replace hardcoded colors by pulling from themes
        <Plus onClick={handleClick} style={iconStyle} color={isLiked? "#f46801": "#ffffff"}/>
    )
}