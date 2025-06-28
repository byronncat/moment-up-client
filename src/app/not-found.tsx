import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.notFound;

import { ErrorPage } from "@/components/pages";
export default function NotFound() {
  return <ErrorPage type="not-found" navigateButton />;
}
