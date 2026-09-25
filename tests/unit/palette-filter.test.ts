import { describe, expect, it } from "vitest";
import { paletteFilter } from "@/components/ui/CommandPalette";

/**
 * The values below are the real ones the palette builds, so these tests fail
 * for the same reason production did rather than for a synthetic one:
 *   projects -> `${title} ${techStack.join(" ")}`
 *   posts    -> `${title} ${tags.join(" ")}`
 *   themes   -> `theme ${label}`
 */
const SWIFT = "Swift Digital Seva Next.js 16 TypeScript Hono Drizzle ORM";
const TRIPMATES = "Tripmates Next.js 16 TypeScript Tailwind CSS v4 shadcn/ui";
const DJI_POST = "Turn a DJI Mic Into a Hands-Free Note Taker macOS Karabiner DJI HID";
const CLAUDE_POST = "Run Claude Code From Your Phone macOS SSH tmux Tailscale";
const THEME_DARK = "theme Dark";
const THEME_LIGHT = "theme Light";
const COPY_EMAIL = "copy email address";

const matches = (value: string, search: string) => paletteFilter(value, search) > 0;

describe("paletteFilter", () => {
  describe("the two bugs that shipped", () => {
    it('"dark" no longer matches a post title, so Enter sets the theme', () => {
      // Subsequence scoring found d-a-r-k inside the long title and, because
      // Writing renders above Appearance, Enter opened the post instead.
      expect(matches(DJI_POST, "dark")).toBe(false);
      expect(matches(THEME_DARK, "dark")).toBe(true);
    });

    it('"dji" no longer matches Swift Digital Seva', () => {
      // Digital / Next.js / TypeScript supplied d, j and i in order.
      expect(matches(SWIFT, "dji")).toBe(false);
      expect(matches(DJI_POST, "dji")).toBe(true);
    });
  });

  describe("ordinary searches still work", () => {
    it("matches case-insensitively", () => {
      expect(matches(DJI_POST, "DJI")).toBe(true);
      expect(matches(THEME_LIGHT, "LIGHT")).toBe(true);
    });

    it("matches on a tag as well as the title", () => {
      expect(matches(CLAUDE_POST, "tailscale")).toBe(true);
      expect(matches(DJI_POST, "karabiner")).toBe(true);
    });

    it("matches a prefix of a word", () => {
      expect(matches(CLAUDE_POST, "claud")).toBe(true);
      expect(matches(SWIFT, "drizz")).toBe(true);
    });

    it("ANDs multi-word queries rather than requiring one literal run", () => {
      expect(matches(COPY_EMAIL, "copy email")).toBe(true);
      expect(matches(DJI_POST, "dji mic")).toBe(true);
      // Both tokens must be present, not just one.
      expect(matches(COPY_EMAIL, "copy github")).toBe(false);
    });

    it("finds names whose punctuation the user did not type", () => {
      // Requiring a literal substring made these unreachable, because the
      // values say "Next.js" and "shadcn/ui" while people type them plainly.
      expect(matches(SWIFT, "nextjs")).toBe(true);
      expect(matches(TRIPMATES, "shadcnui")).toBe(true);
      expect(matches(SWIFT, "next.js")).toBe(true);
    });

    it("stripping punctuation does not resurrect the original bugs", () => {
      // Squashing removes word boundaries, so it could create new false
      // positives across adjacent words. It must not.
      expect(matches(DJI_POST, "dark")).toBe(false);
      expect(matches(SWIFT, "dji")).toBe(false);
    });

    it("shows everything when the query is empty or whitespace", () => {
      expect(paletteFilter(SWIFT, "")).toBeGreaterThan(0);
      expect(paletteFilter(SWIFT, "   ")).toBeGreaterThan(0);
    });
  });

  describe("ranking", () => {
    it("ranks a word-boundary match above one buried mid-word", () => {
      const boundary = paletteFilter("theme Dark", "dark");
      const midWord = paletteFilter("xxdark yyy", "dark");
      expect(boundary).toBeGreaterThan(midWord);
    });

    it("prefers the shorter, more specific value when both match at a boundary", () => {
      const short = paletteFilter("theme Dark", "dark");
      const long = paletteFilter("theme Dark and a great deal of other text here", "dark");
      expect(short).toBeGreaterThan(long);
    });
  });
});
