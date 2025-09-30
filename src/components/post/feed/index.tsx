import type { FeedItemDto } from "api";
import type { Actions } from "../../providers/PostStorage";

import { cn } from "@/libraries/utils";
import { Card } from "../../ui/card";
import Header from "./Header";
import Content from "./Content";
import ButtonGroup from "./ButtonGroup";

type FeedCardProps = Readonly<{
  data: FeedItemDto;
  className?: string;
  actions: Actions;
  onClick?: () => void;
}>;

export default function FeedCard({
  data,
  className,
  actions,
  onClick,
}: FeedCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} onClick={onClick}>
      <Header data={data} actions={actions} />
      <Content postId={data.id} postData={data.post} />
      <ButtonGroup data={data} actions={actions} />
    </Card>
  );
}
