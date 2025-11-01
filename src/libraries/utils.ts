import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the browser history is safe to navigate back.
 * Returns true only if:
 * 1. There is more than one entry in the history
 * 2. The referrer (previous page) belongs to the current host
 *
 * This prevents navigating back to external sites when users
 * arrive from external links.
 */
export function canSafelyGoBack(): boolean {
  if (typeof window === "undefined" || window.history.length <= 1) return false;

  // Check if the referrer is from the same origin
  const { referrer } = document;
  if (!referrer) return false;

  try {
    const referrerUrl = new URL(referrer);
    const { origin: currentOrigin } = window.location;
    return referrerUrl.origin === currentOrigin;
  } catch {
    // If referrer is not a valid URL, don't go back
    return false;
  }
}
