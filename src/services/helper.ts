import { ErrorResponse } from "api";
import { FIRST } from "@/constants/client";

export function parseErrorMessage(error: ErrorResponse) {
  return Array.isArray(error.message) ? error.message[FIRST] : error.message;
}
