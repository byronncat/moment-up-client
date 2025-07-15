import ClientCookie from "./client-cookie";
import ServerCookie from "./server-cookie";

export function getAuthHeaders(): Record<string, string> {
  if (ServerCookie.getHeader()) return ServerCookie.getAuthHeaders();
  return ClientCookie.getAuthHeaders();
}

export { ClientCookie, ServerCookie };
