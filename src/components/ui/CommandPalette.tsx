"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Copy, Moon, Monitor, Sun } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";
import { GithubMark, LinkedinMark } from "./BrandMarks";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";
import { applyTheme, getServerTheme, getThemeSnapshot, subscribeToTheme } from "@/lib/theme";

/**
 * Keyboard-first navigation, opened with ⌘K / Ctrl+K.
 *
 * The site already speaks in terminal idiom — mono type, `// comments`,
 * `cd ../projects` — but navigation was a conventional nav bar, so the
 * aesthetic was decorative. This makes it operable.
 *
 * Mounted once in the root layout. It renders nothing until opened, so it
 * costs a keydown listener and no markup on first paint.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // The toggle is tri-state (light / dark / system); read it from the same
  // external store the header toggle uses so the two never disagree.
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerTheme);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // metaKey covers ⌘ on macOS, ctrlKey the rest. Ignore repeats so
      // holding the chord doesn't flip it open and shut.
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.repeat) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /** Close first, then act — otherwise the dialog's focus restore fights the
   *  route change and the new page loads with focus still on the trigger. */
  const run = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search for a page, project, or action"
      className="border-border"
    >
      {/* shadcn's CommandDialog renders children straight into DialogContent
          without a <Command> root, so cmdk's store context is undefined and
          every CommandInput/CommandList throws "reading 'subscribe'". Supply
          the root here. */}
      <Command>
        <CommandInput placeholder="Type a command or search…" />
      <CommandList>
          <CommandEmpty>
            <span className="font-mono text-sm text-muted-foreground">
              {"// no matches"}
            </span>
          </CommandEmpty>

          <CommandGroup heading="Go to">
            {siteConfig.nav
              .filter((item) => !item.soon)
              .map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.href}`}
                  onSelect={() => run(() => router.push(item.href))}
                >
                  <span className="font-mono text-muted-foreground">cd</span>
                  <span>{item.label}</span>
                  <CommandShortcut className="font-mono">{item.href}</CommandShortcut>
                </CommandItem>
              ))}
            <CommandItem value="home /" onSelect={() => run(() => router.push("/"))}>
              <span className="font-mono text-muted-foreground">cd</span>
              <span>Home</span>
              <CommandShortcut className="font-mono">/</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={`${project.title} ${project.techStack.join(" ")}`}
                onSelect={() => run(() => router.push(`/projects/${project.slug}`))}
              >
                <span className="font-mono text-muted-foreground">open</span>
                <span>{project.title}</span>
                <CommandShortcut className="font-mono">
                  {project.techStack[0]}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
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
                {theme === value && (
                  <CommandShortcut className="font-mono">active</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Elsewhere">
            <CommandItem
              value="copy email address"
              onSelect={() =>
                run(() => {
                  void navigator.clipboard?.writeText(siteConfig.email);
                })
              }
            >
              <Copy />
              <span>Copy email</span>
              <CommandShortcut className="font-mono">{siteConfig.email}</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="github profile"
              onSelect={() => run(() => window.open(siteConfig.social.github, "_blank", "noopener,noreferrer"))}
            >
              <GithubMark className="size-4" />
              <span>GitHub</span>
              <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />
            </CommandItem>
            <CommandItem
              value="linkedin profile"
              onSelect={() => run(() => window.open(siteConfig.social.linkedin, "_blank", "noopener,noreferrer"))}
            >
              <LinkedinMark className="size-4" />
              <span>LinkedIn</span>
              <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />
            </CommandItem>
          </CommandGroup>
          </CommandList>
      </Command>
    </CommandDialog>
  );
}
