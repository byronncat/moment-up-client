interface ClientCookieOptions {
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  maxAge?: number;
}

const isHttps = process.env.NEXT_PUBLIC_HTTPS === "true";

const DefaultOptions: ClientCookieOptions = {
  secure: isHttps,
  sameSite: isHttps ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60,
};

const ClientCookie = (
  cookieName: string,
  options: ClientCookieOptions = DefaultOptions
) => {
  const secure = options.secure ? "; secure" : "";
  const sameSite = options.sameSite
    ? `; samesite=${options.sameSite.toLowerCase()}`
    : "";

  return {
    set: (value: string = ""): string => {
      return `${cookieName}=${encodeURIComponent(value)}; path=/; max-age=${options.maxAge}${secure}${sameSite}`;
    },

    get: (): string | null => {
      if (typeof document === "undefined") return null;
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((cookieString) =>
        cookieString.startsWith(`${cookieName}=`)
      );
      return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    },

    remove: (): string => {
      return `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}${sameSite}`;
    },

    exists: (): boolean => {
      if (typeof document === "undefined") return false;
      return document.cookie.includes(cookieName);
    },
  };
};

export default ClientCookie;
