/** Format an ISO yyyy-mm-dd date as e.g. "May 22, 2026", pinned to UTC so the
 *  rendered string is stable across server and client regardless of timezone. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
