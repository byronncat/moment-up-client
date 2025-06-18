import type { DetailedMomentInfo } from "api";
import type { Actions } from "../../providers/MomentData";

import { Card } from "../../ui/card";
import { cn } from "@/libraries/utils";

import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";

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
      <Header data={data} actions={actions} />
      <Content momentId={data.id} postData={data.post} actions={actions} />
      <Footer data={data} actions={actions} />
    </Card>
  );
}
