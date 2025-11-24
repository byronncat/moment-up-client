/* eslint-disable react/no-array-index-key */

import Link from "next/link";

export function parseText(text: string) {
  const normalizedText = text.replace(/\\n/g, "\n");
  // Split by URLs, hashtags, and mentions while preserving them
  // Username format: letters, numbers, dots, underscores (from zodSchema)
  const parts = normalizedText.split(
    /(https?:\/\/[^\s]+|@[a-zA-Z0-9._]+|#[a-zA-Z0-9_]+)/g
  );

  return (
    <>
      {parts.map((part, index) => {
        // Handle URLs (http/https)
        if (part.startsWith("http://") || part.startsWith("https://")) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 font-medium hover:underline"
            >
              {part}
            </a>
          );
        }

        // Handle mentions (@username)
        if (part.startsWith("@")) {
          return (
            <Link
              key={index}
              href={`/profile/${part.slice(1)}`}
              className="text-blue-500 dark:text-blue-400 font-medium hover:underline"
            >
              {part}
            </Link>
          );
        }

        // Handle hashtags (#tag)
        if (part.startsWith("#")) {
          return (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(part)}`}
              className="text-blue-500 dark:text-blue-400 font-medium hover:underline"
            >
              {part}
            </Link>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
