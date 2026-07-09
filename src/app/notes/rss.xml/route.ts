import { getAllNotes } from "@/lib/notes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const notes = getAllNotes();
  // getAllNotes() is sorted newest-first, so the first item dates the channel.
  const lastBuildDate = notes.length
    ? new Date(notes[0].date + "T00:00:00Z").toUTCString()
    : new Date(0).toUTCString();
  const items = notes
    .map((n) => {
      const url = `${SITE_URL}/notes/${n.slug}`;
      const pubDate = new Date(n.date + "T00:00:00Z").toUTCString();
      return `
    <item>
      <title>${escape(n.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escape(n.excerpt)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anmol Malhan · Notes</title>
    <link>${SITE_URL}/notes</link>
    <description>Field notes from building interfaces.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/notes/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
