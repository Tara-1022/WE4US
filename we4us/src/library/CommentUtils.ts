import { Comment, CommentView } from "lemmy-js-client";

// https://stackoverflow.com/questions/51716808/when-use-a-interface-or-class-in-typescript
export interface CommentNodeI {
  commentView: CommentView;
  children: Array<CommentNodeI>;
  depth: number;
}

export function getDepthFromComment(
  comment: Comment,
): number {
  return comment.path.split(".").length - 2;
  // a comment at depth 0 has the form "0.x"
}

export function getImmediateParentID(
  comment: Comment,
): number {
  const split = comment.path.split(".");
  return Number(split[split.length - 2]);
}

export default function buildCommentsTree(
  commentViews: CommentView[]): CommentNodeI[]{
    const map = new Map<number, CommentNodeI>();

    // First, extract relevant information
    // making it easy to fetch a node
    for (const commentView of commentViews){
      const depth = getDepthFromComment(commentView.comment);
      const node: CommentNodeI = {
        commentView, children: [], depth
      };
      // unpack node object to create a copy
      map.set(commentView.comment.id, {...node});
    }

    const tree: CommentNodeI[] = [];
    // set children appropriately
    map.forEach(
      (commentNode: CommentNodeI) => {
        const parentId = getImmediateParentID(commentNode.commentView.comment);
        if (parentId == 0){
          tree.push(commentNode);
        }
        else{
          map.get(parentId)?.children.push(commentNode);
        }
      }
    )

    return tree;
  }