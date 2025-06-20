import type { DetailedMomentInfo } from "api";
import type { Actions } from "../../providers/MomentData";

import { Card } from "../../ui/card";
import { cn } from "@/libraries/utils";

import MomentHeader from "./Header";
import MomentContent from "./Content";
import MomentButtonGroup from "./ButtonGroup";

type MomentCardProps = Readonly<{
  data: DetailedMomentInfo;
  className?: string;
  actions: Actions;
  onClick: () => void;
}>;

export default function MomentCard({
  data,
  className,
  actions,
  onClick,
}: MomentCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} onClick={onClick}>
      <MomentHeader data={data} actions={actions} />
      <MomentContent
        momentId={data.id}
        postData={data.post}
        actions={actions}
      />
      <MomentButtonGroup data={data} actions={actions} />
    </Card>
  );
}
