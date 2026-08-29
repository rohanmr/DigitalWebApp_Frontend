export function getActiveNavUrl(
  pathname: string,
  urls: string[],
): string | null {
  const matches = urls.filter(
    (url) => pathname === url || pathname.startsWith(url + "/"),
  );
  if (matches.length === 0) return null;
  // Longest (most specific) match wins — e.g. "/admin/donations/add"
  // beats "/admin/donations" when both technically match.
  return matches.reduce((best, current) =>
    current.length > best.length ? current : best,
  );
}
