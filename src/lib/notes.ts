import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

export type Note = {
  slug: string;
  title: string;
  date: string;          // ISO yyyy-mm-dd
  excerpt: string;
  tags?: string[];
  readingTime: string;   // "5 min read"
};

export type NoteWithContent = Note & {
  html: string;
};

const NOTES_DIR = path.join(process.cwd(), "src", "content", "notes");

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

function getNoteFiles(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("."));
}

function readNote(file: string): { data: matter.GrayMatterFile<string>["data"]; content: string; slug: string } {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(NOTES_DIR, file), "utf8");
  const parsed = matter(raw);
  return { data: parsed.data, content: parsed.content, slug };
}

function estimateReadingTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function getAllNotes(): Note[] {
  return getNoteFiles()
    .map((file) => {
      const { data, content, slug } = readNote(file);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        tags: data.tags ?? undefined,
        readingTime: estimateReadingTime(content),
      } as Note;
    })
    .filter((n) => n.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNoteBySlug(slug: string): Promise<NoteWithContent | null> {
  const file = `${slug}.md`;
  const fullPath = path.join(NOTES_DIR, file);
  if (!fs.existsSync(fullPath)) return null;
  const { data, content } = readNote(file);
  const html = await marked.parse(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? undefined,
    readingTime: estimateReadingTime(content),
    html: html.toString(),
  };
}
