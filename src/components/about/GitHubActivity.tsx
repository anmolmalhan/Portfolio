"use client";

import { useSyncExternalStore } from "react";
import { GitHubCalendar } from "react-github-calendar";
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

export default function GitHubActivity({ username }: GitHubActivityProps) {
  // The calendar must follow the site's active theme, otherwise the empty
  // cells (near-black in the dark palette) clash with the light card. Track
  // the resolved scheme reactively so toggling theme repaints the calendar.
  const scheme = useSyncExternalStore(subscribeToScheme, getResolvedScheme, getServerScheme);

  return (
    <div className="mt-20 pt-8 border-t border-surface/30">
      <div className="flex items-center gap-3 mb-8">
        <GithubMark className="w-6 h-6 text-foreground" />
        <h2 className="text-2xl font-bold text-foreground">Open Source Activity</h2>
      </div>
      
      <div className="bg-surface/30 border border-surface p-6 sm:p-8 rounded-xl overflow-hidden">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="min-w-[800px] flex justify-center">
            <GitHubCalendar
              username={username}
              colorScheme={scheme}
              theme={explicitTheme}
              fontSize={14}
              blockSize={12}
              blockMargin={4}
              style={calendarStyle}
            />
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--syntax-comment)] text-center sm:text-left">
          Contributions to public repositories on GitHub.
        </p>
      </div>
    </div>
  );
}
