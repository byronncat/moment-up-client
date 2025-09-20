/* eslint-disable require-await */
import type { ErrorDto } from "api";

export async function SWRFetcher<T = void>(
  url: string
): Promise<T | undefined> {
  return fetch(url, {
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
    .catch((error: ErrorDto) => {
      throw error;
    });
}

export async function SWRFetcherWithToken<T = void>(
  url: string,
  token: string
): Promise<T | undefined> {
  return fetch(url, {
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
    .catch((error: ErrorDto) => {
      throw error;
    });
}
