import { Plus } from "lucide-react";
import { likeComment, likePost, undoLikeComment, undoLikePost } from "../library/LemmyApi";
import { useState } from "react";

export default function LikeHandler({ forPost, isInitiallyLiked, id, initialLikes }:
    { forPost: boolean, isInitiallyLiked: boolean, id: number, initialLikes: number }) {
    const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
    const [likes, setLikes] = useState<number>(initialLikes);
    const likeAdder = forPost ? likePost : likeComment;
    const likeRemover = forPost ? undoLikePost : undoLikeComment;

    const styles = {
        container: {
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "#a0a8b0"
        },
        likeCount: {
            fontSize: "14px",
            fontWeight: "500" as const
        },
        icon: {
            cursor: "pointer",
            transition: "transform 0.2s ease",
            "&:hover": {
                transform: "scale(1.2)"
            }
        }
    };

    function handleClick(event: React.MouseEvent<SVGSVGElement>) {
        event.preventDefault();
        const task = isLiked ? likeRemover : likeAdder;

        task(id).then(
            (_response) => {
                setLikes(isLiked? likes-1: likes+1)
                setIsLiked(!isLiked);
            }
        )
    }

    return (
        <div style={styles.container}>
            <span style={styles.likeCount}>{likes}</span>
            <Plus 
                onClick={handleClick} 
                style={styles.icon} 
                color={isLiked? "#ff7b00": "#a0a8b0"}
                size={18}
            />
        </div>
    )
}