export function normalizeURL(url: string): string {
  const parsed = new URL(url);
  // host is already lowercase and excludes default ports
  let path = parsed.pathname;
  // Strip trailing slashes
  path = path.replace(/\/+$/, "");
  return `${parsed.hostname}${path}`;
}
