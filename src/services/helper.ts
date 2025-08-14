import { ErrorResponse } from "api";
import { FIRST } from "@/constants/clientConfig";

export function parseErrorMessage(error: ErrorResponse) {
  return Array.isArray(error.message) ? error.message[FIRST] : error.message;
}
