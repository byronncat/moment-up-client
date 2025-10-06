import { INITIAL_PAGE } from "@/constants/server";

export const SWRInfiniteOptions = {
  initialSize: INITIAL_PAGE,
  revalidateFirstPage: false,
  errorRetryCount: 0,
};
