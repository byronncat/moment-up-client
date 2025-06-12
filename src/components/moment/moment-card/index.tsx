import type { DetailedMoment } from "api";

import { Card } from "../../ui/card";
import { cn } from "@/libraries/utils";
import DataProvider from "./provider/Data";

import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";

type MomentCardProps = Readonly<{
  data: DetailedMoment;
  className?: string;
  actions: {
    like: (momentId: string) => void;
    bookmark: (momentId: string) => void;
  };
}>;

export default function MomentCard({ data, className, actions }: MomentCardProps) {
  return (
    <DataProvider initialData={data} actions={actions}>
      <Card className={cn("overflow-hidden", className)}>
        <Header  />
        <Content />
        <Footer />
      </Card>
    </DataProvider>
  );
}
