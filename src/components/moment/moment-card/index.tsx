import type { MomentInfo } from "api";
import type { Actions } from "../../providers/MomentStorage";

import { Card } from "../../ui/card";
import { cn } from "@/libraries/utils";

import MomentHeader from "./Header";
import MomentContent from "./Content";
import MomentButtonGroup from "./ButtonGroup";

type MomentCardProps = Readonly<{
  data: MomentInfo;
  className?: string;
  actions: Actions;
  onClick?: () => void;
}>;

export default function MomentCard({
  data,
  className,
  actions,
  onClick,
}: MomentCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} onClick={onClick}>
      <MomentHeader
        data={data}
        actions={actions}
        truncateClassName="truncate max-w-[192px] md:max-w-[320px]"
      />
      <MomentContent momentId={data.id} postData={data.post} />
      <MomentButtonGroup data={data} actions={actions} />
    </Card>
  );
}
