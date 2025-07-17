import type { ErrorResponse } from "api";

export * as AuthApi from "./auth";
export * as CoreApi from "./core";
export * as SearchApi from "./search";
export * as UserApi from "./user";
export * as NotifyApi from "./notify";
export * as SuggestApi from "./suggest";
export * from "./api.constant";

export async function swrFetcher<T = void>(
  url: string
): Promise<T | undefined> {
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    })
    .catch(async (error: ErrorResponse) => {
      throw new Error(error.message as string);
    });
}

export async function swrFetcherWithToken<T = void>(
  url: string,
  token: string
): Promise<T | undefined> {
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    })
    .catch(async (error: ErrorResponse) => {
      throw new Error(error.message as string);
    });
}
