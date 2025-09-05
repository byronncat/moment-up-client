import type { ErrorResponse } from "api";

export function parseErrorMessage(error: ErrorResponse) {
  return Array.isArray(error.message) ? error.message[0] : error.message;
}
