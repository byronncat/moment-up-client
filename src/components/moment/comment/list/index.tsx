import { useComment } from "@/components/providers";
import Item from "./Item";

export default function CommentList() {
  const { comments, isExpanded, toggleExpansion } = useComment();

  return comments?.map((comment) => (
    <Item
      key={comment.id}
      comment={comment}
      isExpanded={isExpanded(comment.id)}
      onToggleExpand={() => toggleExpansion(comment.id)}
    />
  ));
}
