"use client";

import type { DetailedMoment } from "api";
import { createContext, useContext } from "react";

const DataContext = createContext(
  {} as {
    momentId: DetailedMoment["id"];
    userData: DetailedMoment["user"];
    postData: DetailedMoment["post"];
    like: () => void;
    bookmark: () => void;
  }
);

export const useData = () => useContext(DataContext);

type DataProviderProps = Readonly<{
  children: React.ReactNode;
  initialData: DetailedMoment;
  actions: {
    like: (momentId: string) => void;
    bookmark: (momentId: string) => void;
  };
}>;

export default function DataProvider({
  children,
  initialData,
  actions,
}: DataProviderProps) {
  const momentId = initialData.id;
  const userData = initialData.user;
  const postData = initialData.post;

  return (
    <DataContext.Provider
      value={{
        momentId,
        userData,
        postData,
        like: () => actions.like(momentId),
        bookmark: () => actions.bookmark(momentId),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
