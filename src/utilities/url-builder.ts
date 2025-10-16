interface UrlBuilderOptions {
  /** Path parameters to replace in the template (e.g., { userId: "123" } for "/users/:userId") */
  pathParams?: Record<string, string | number>;
  /** Query parameters to append (e.g., { page: 1, limit: 10 } for "?page=1&limit=10") */
  queryParams?: Record<string, string | number | undefined>;
  /** Whether to use .set() or .append() for URLSearchParams (default: append) */
  useSetForQuery?: boolean;
}

/**
 * Build a complete URL/path with both path parameters and query parameters
 *
 * @param template - URL template with optional :param placeholders
 * @param options - Configuration object with pathParams and queryParams
 * @returns Complete URL/path with parameters replaced and query string appended
 *
 * @example
 * // Path parameters only
 * buildUrl("/users/:userId/posts", { pathParams: { userId: "123" } })
 * // Returns: "/users/123/posts"
 *
 * @example
 * // Query parameters only
 * buildUrl("/search", { queryParams: { q: "hello", page: 1 } })
 * // Returns: "/search?q=hello&page=1"
 *
 * @example
 * // Both path and query parameters
 * buildUrl("/users/:userId/posts", {
 *   pathParams: { userId: "123" },
 *   queryParams: { page: 1, limit: 10 }
 * })
 * // Returns: "/users/123/posts?page=1&limit=10"
 *
 * @example
 * // API URL with server host
 * buildUrl("https://api.example.com/v1/users/:userId", {
 *   pathParams: { userId: "123" },
 *   queryParams: { include: "profile" }
 * })
 * // Returns: "https://api.example.com/v1/users/123?include=profile"
 */
export function buildUrl(
  template: string,
  options: UrlBuilderOptions = {}
): string {
  const { pathParams, queryParams, useSetForQuery = false } = options;

  // Step 1: Replace path parameters
  let url = template;
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value.toString());
    });
  }

  // Step 2: Add query parameters
  if (queryParams) {
    const urlParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (useSetForQuery) {
          urlParams.set(key, value.toString());
        } else {
          urlParams.append(key, value.toString());
        }
      }
    });

    const queryString = urlParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}

/**
 * Convenience function for building URLs with path parameters only
 */
export function buildPath(
  template: string,
  pathParams: Record<string, string | number>
): string {
  return buildUrl(template, { pathParams });
}

/**
 * Convenience function for building URLs with query parameters only
 */
export function buildQuery(
  baseUrl: string,
  queryParams: Record<string, string | number | undefined>,
  useSet = false
): string {
  return buildUrl(baseUrl, { queryParams, useSetForQuery: useSet });
}

const UrlBuilder = {
  build: buildUrl,
  path: buildPath,
  query: buildQuery,
};

export default UrlBuilder;
