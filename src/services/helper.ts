import type { ErrorDto } from "api";

export function parseErrorMessage(error: ErrorDto) {
  return Array.isArray(error.message) ? error.message[0] : error.message;
}
