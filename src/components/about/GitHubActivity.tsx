"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { getResolvedScheme, getServerScheme, subscribeToScheme } from "@/lib/theme";
import { GithubMark } from "@/components/ui/BrandMarks";

interface GitHubActivityProps {
  username: string;
}

// Canonical GitHub palettes: light gray → green on light, dark → green on dark.
const explicitTheme = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
};

const calendarStyle = { color: 'var(--foreground)' };

/**
 * Client-only. The calendar fetches contributions in the browser and renders
 * different markup than the server does, which threw a hydration mismatch on
 * every /about load ("server rendered HTML didn't match the client"). Skipping
 * SSR for this subtree removes the mismatch outright; there is nothing to
 * prerender anyway, since the data only exists after the client fetch.
 */
const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      /* Matches the min-h-[160px] its container reserves, so swapping the real
         calendar in doesn't nudge the panel. */
      <div
        className="h-[160px] w-full animate-pulse rounded-md bg-muted"
        aria-label="Loading contribution graph"
      />
    ),
  },
);

export default function GitHubActivity({ username }: GitHubActivityProps) {
  // The calendar must follow the site's active theme, otherwise the empty
  // cells (near-black in the dark palette) clash with the light card. Track
  // the resolved scheme reactively so toggling theme repaints the calendar.
  const scheme = useSyncExternalStore(subscribeToScheme, getResolvedScheme, getServerScheme);

  return (
    <section className="mt-24 md:mt-32" aria-labelledby="activity-heading">
      <h2
        id="activity-heading"
        className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-8"
      >
        {"// open source activity"}
      </h2>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* The calendar is fetched client-side from GitHub's API. Reserve its
            height so a slow or failed request doesn't collapse the panel and
            then shove the footer down when it resolves. */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="min-w-[800px] min-h-[160px] flex justify-center">
            <GitHubCalendar
              username={username}
              colorScheme={scheme}
              theme={explicitTheme}
              fontSize={14}
              blockSize={12}
              blockMargin={4}
              style={calendarStyle}
              /* Without this the component renders nothing on a failed fetch,
                 leaving an unexplained blank slab on the page. */
              errorMessage="Couldn't reach GitHub just now. The contribution graph is live at github.com/anmolmalhan."
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <GithubMark className="h-4 w-4" aria-hidden />
          <span>Contributions to public repositories on GitHub.</span>
        </div>
      </div>
    </section>
  );
}
