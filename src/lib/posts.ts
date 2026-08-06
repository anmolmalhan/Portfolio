import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Build-time index of src/content/blog.
 *
 * Posts are plain .mdx files with YAML frontmatter. This module reads only the
 * frontmatter, so the index page, the sitemap and generateStaticParams can list
 * posts without pulling every post body into the bundle; the [slug] route
 * imports the MDX itself for the rendered content.
 *
 * Node APIs only, so this is server-side. Every caller is a Server Component or
 * a build-time export, which is why there is no "use client" anywhere near it.
 *
 * Adding a post is one file. No registry to update, which is what went wrong
 * with the old /notes section: the list and the articles drifted apart.
 *
 * Posts live under src/ rather than at the repo root so the [slug] route can
 * reach them through the `@/` alias, which tsconfig maps to ./src/*.
 */

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO yyyy-mm-dd. Kept as a string so no timezone shifts the display date. */
  date: string;
  summary: string;
  tags: string[];
  /** Rounded up, 200 wpm. Shown on the card and the post header. */
  readingTime: number;
  /** Frontmatter `draft: true` hides a post from every listing and from the
   *  static params, so it 404s in production but still renders in dev. */
  draft: boolean;
};

const WORDS_PER_MINUTE = 200;

function readingTimeOf(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function parse(fileName: string): PostMeta {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  // Frontmatter is hand-written, so it is validated rather than trusted. A typo
  // in a date or a missing title should fail the build, not ship a post card
  // reading "undefined".
  const title = data.title;
  const date = data.date;
  const summary = data.summary;

  if (typeof title !== "string" || !title.trim()) {
    throw new Error(`src/content/blog/${fileName}: frontmatter "title" is required`);
  }
  if (typeof summary !== "string" || !summary.trim()) {
    throw new Error(`src/content/blog/${fileName}: frontmatter "summary" is required`);
  }
  // gray-matter parses unquoted YAML dates into Date objects; quoted ones stay
  // strings. Normalise both to yyyy-mm-dd.
  const iso =
    date instanceof Date
      ? date.toISOString().slice(0, 10)
      : typeof date === "string"
        ? date.trim()
        : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(
      `src/content/blog/${fileName}: frontmatter "date" must be yyyy-mm-dd, got ${JSON.stringify(date)}`,
    );
  }

  return {
    slug,
    title: title.trim(),
    date: iso,
    summary: summary.trim(),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: readingTimeOf(content),
    draft: data.draft === true,
  };
}

/** Every post, newest first. Drafts are included only outside production. */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parse)
    .filter((p) => !p.draft || process.env.NODE_ENV !== "production")
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): PostMeta | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Display form for a stored yyyy-mm-dd. Fixed to UTC so the rendered date
 *  matches the frontmatter regardless of where the build machine sits. */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
