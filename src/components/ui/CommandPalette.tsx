"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowUpRight,
  AtSign,
  Check,
  FileText,
  FolderGit2,
  Home,
  Mail,
  Monitor,
  Moon,
  Sun,
  User,
  type LucideIcon,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import { GithubMark, LinkedinMark } from "./BrandMarks";
import { projects } from "@/data/projects";
import type { PostMeta } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { applyTheme, getServerTheme, getThemeSnapshot, subscribeToTheme } from "@/lib/theme";

/** Route icons, so every row is scannable by shape before it is read. */
const ROUTE_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/projects": FolderGit2,
  "/about": User,
  "/contact": Mail,
};

/** Right-hand metadata. Deliberately quiet: it annotates, it does not compete. */
function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-slot="command-shortcut"
      className="ml-auto shrink-0 pl-4 font-mono text-[11px] tracking-wide text-muted-foreground/70"
    >
      {children}
    </span>
  );
}

function Hint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {keys.map((k) => (
        <kbd
          key={k}
          className="flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground"
        >
          {k}
        </kbd>
      ))}
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </span>
  );
}

/**
 * Keyboard-first navigation, opened with ⌘K / Ctrl+K.
 *
 * The site speaks in terminal idiom, but the palette does not lean on it:
 * an earlier pass prefixed every row with a mono `cd` / `open`, which read as
 * filler, made the left edge ragged and gave nothing to scan by. Rows now lead
 * with an icon, metadata sits quietly on the right, and a hint bar spells out
 * the keys — the shape people already expect from a command surface.
 *
 * Mounted once in the root layout. Renders no markup until opened, so it costs
 * a keydown listener and nothing on first paint.
 *
 * Known limitation: cmdk derives `aria-activedescendant` from its internal
 * `selectedItemId`, which stays empty until the first arrow press. On open a
 * row is therefore highlighted visually while a screen reader has nothing to
 * announce; it corrects itself as soon as the user navigates. Controlling the
 * `value` prop was tried and does not populate it. Mirroring the selection into
 * the attribute by hand would mean observing cmdk's DOM and fighting the
 * library, for a surface that is a shortcut to destinations the normal nav
 * already exposes, so it is left as is.
 */
export function CommandPalette({ posts = [] }: { posts?: PostMeta[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  /** Element focused at the moment the palette opened.
   *
   *  Radix restores focus on close by itself, but the header trigger opens the
   *  palette by dispatching a synthetic ⌘K keydown rather than by being a
   *  DialogTrigger, so Radix never learns which control it came from and focus
   *  lands on <body>. A keyboard user then has to tab from the top of the
   *  document again. Capture it here and put it back ourselves. */
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  // The toggle is tri-state (light / dark / system); read it from the same
  // external store the header toggle uses so the two never disagree.
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerTheme);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // metaKey covers ⌘ on macOS, ctrlKey the rest. Ignore repeats so holding
      // the chord doesn't flip it open and shut.
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.repeat) {
        e.preventDefault();
        setOpen((v) => {
          const next = !v;
          if (next) {
            const active = document.activeElement;
            restoreFocusTo.current = active instanceof HTMLElement && active !== document.body ? active : null;
          }
          return next;
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /** Close first, then act — otherwise the dialog's focus restore fights the
   *  route change and the new page loads with focus still on the trigger. */
  const run = useCallback((action: () => void) => {
    // Dismissing to go somewhere else: the destination owns focus from here,
    // so drop the saved trigger rather than yanking focus back to the header.
    restoreFocusTo.current = null;
    setOpen(false);
    action();
  }, []);

  /** Plain dismissal (Escape, outside click): hand focus back where it was. */
  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (next) return;
    const target = restoreFocusTo.current;
    restoreFocusTo.current = null;
    // Queued so it runs after Radix's own close-time focus handling, which
    // would otherwise overwrite this a tick later.
    if (target?.isConnected) requestAnimationFrame(() => target.focus());
  }, []);

  const navItems = siteConfig.nav.filter((item) => !item.soon);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command palette"
      description="Search for a page, project, or action"
      className="max-w-xl! overflow-hidden rounded-2xl! border-border p-0 shadow-2xl shadow-black/40"
    >
      {/* shadcn's CommandDialog renders children straight into DialogContent
          without a <Command> root, so cmdk's store context is undefined and
          every CommandInput/CommandList throws "reading 'subscribe'". */}
      <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground/60 [&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:rounded-lg [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]_svg]:size-4 [&_[cmdk-item]_svg]:text-muted-foreground [&_[cmdk-item][data-selected=true]_svg]:text-foreground">
        <CommandInput placeholder="Search pages, projects, and actions…" />

        <CommandList className="max-h-[22rem] p-2">
          <CommandEmpty className="py-10 text-center">
            <span className="font-mono text-sm text-muted-foreground">
              {"// no matches"}
            </span>
          </CommandEmpty>

          <CommandGroup heading="Pages">
            <CommandItem value="home overview" onSelect={() => run(() => router.push("/"))}>
              <Home />
              <span>Home</span>
              <Meta>/</Meta>
            </CommandItem>
            {navItems.map((item) => {
              const Icon = ROUTE_ICONS[item.href] ?? FolderGit2;
              return (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.href}`}
                  onSelect={() => run(() => router.push(item.href))}
                >
                  <Icon />
                  <span>{item.label}</span>
                  <Meta>{item.href}</Meta>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator className="my-2" />

          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={`${project.title} ${project.techStack.join(" ")}`}
                onSelect={() => run(() => router.push(`/projects/${project.slug}`))}
              >
                {/* The project's own thumbnail rather than a shared folder
                    glyph. Four identical icons gave the eye nothing to sort
                    by; the artwork makes each row identifiable at a glance.
                    Loaded only when the palette opens. */}
                {project.image ? (
                  <Image
                    src={project.image}
                    alt=""
                    width={40}
                    height={24}
                    className="size-auto h-6 w-10 shrink-0 rounded-[3px] border border-border/60 object-cover"
                  />
                ) : (
                  <FolderGit2 />
                )}
                <span>{project.title}</span>
                <Meta>{project.techStack.slice(0, 2).join(" · ")}</Meta>
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Posts are passed down from the root layout: reading them needs
              node:fs, which a client component cannot do. Without this group
              the blog was reachable from the nav and the sitemap but invisible
              to the one surface built for finding things. */}
          {posts.length > 0 ? (
            <>
              <CommandSeparator className="my-2" />
              <CommandGroup heading="Writing">
                {posts.map((post) => (
                  <CommandItem
                    key={post.slug}
                    /* Title and tags only. cmdk scores by subsequence, so
                       folding the summary in here made every post match almost
                       anything: a sentence of prose contains the letters of
                       "light" in order, which put this group (rendered above
                       Appearance) ahead of the theme commands and hijacked
                       Enter. Keep the haystack small enough to stay precise. */
                    value={`${post.title} ${post.tags.join(" ")}`}
                    onSelect={() => run(() => router.push(`/blog/${post.slug}`))}
                  >
                    <FileText />
                    <span className="truncate">{post.title}</span>
                    <Meta>{post.readingTime} min</Meta>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}

          <CommandSeparator className="my-2" />

          <CommandGroup heading="Appearance">
            {(
              [
                { value: "light", label: "Light", Icon: Sun },
                { value: "dark", label: "Dark", Icon: Moon },
                { value: "system", label: "System", Icon: Monitor },
              ] as const
            ).map(({ value, label, Icon }) => (
              <CommandItem
                key={value}
                value={`theme ${label}`}
                onSelect={() => run(() => applyTheme(value))}
              >
                <Icon />
                <span>{label}</span>
                {theme === value && <Check className="ml-auto text-accent!" />}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="my-2" />

          <CommandGroup heading="Connect">
            <CommandItem
              value="copy email address"
              onSelect={() =>
                run(() => {
                  void navigator.clipboard?.writeText(siteConfig.email);
                })
              }
            >
              <AtSign />
              <span>Copy email</span>
              <Meta>{siteConfig.email}</Meta>
            </CommandItem>
            <CommandItem
              value="github profile"
              onSelect={() =>
                run(() => window.open(siteConfig.social.github, "_blank", "noopener,noreferrer"))
              }
            >
              <GithubMark className="size-4" />
              <span>GitHub</span>
              <ArrowUpRight className="ml-auto" />
            </CommandItem>
            <CommandItem
              value="linkedin profile"
              onSelect={() =>
                run(() => window.open(siteConfig.social.linkedin, "_blank", "noopener,noreferrer"))
              }
            >
              <LinkedinMark className="size-4" />
              <span>LinkedIn</span>
              <ArrowUpRight className="ml-auto" />
            </CommandItem>
          </CommandGroup>
        </CommandList>

        {/* Spells out the interaction rather than assuming it. */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2.5">
          <Hint keys={["↑", "↓"]} label="Navigate" />
          <Hint keys={["↵"]} label="Select" />
          <Hint keys={["esc"]} label="Close" />
        </div>
      </Command>
    </CommandDialog>
  );
}
