import { createContext } from "react";
import { CommentView } from 'lemmy-js-client';
import { useSafeContext } from "../library/useSafeContext";

export type commentsContextValueType = {
    comments: CommentView[];
    setComments: React.Dispatch<React.SetStateAction<CommentView[]>>;
    postId: number;
}

export const CommentsContext = createContext<commentsContextValueType | undefined>(undefined);

export const useCommentsContext = () => {
    return useSafeContext<commentsContextValueType>(CommentsContext, "Comments Context");
}