"use client";

import { GitHubCalendar } from "react-github-calendar";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.19 1.18a11 11 0 0 1 5.8 0c2.22-1.49 3.18-1.18 3.18-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56 4.56-1.53 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

interface GitHubActivityProps {
  username: string;
}

export default function GitHubActivity({ username }: GitHubActivityProps) {
  // Use a monochromatic color scale based on the syntax green token, 
  // or a blue accent token depending on preference.
  // react-github-calendar accepts a `colorScheme` prop for dark/light mode,
  // or `theme` to override exact colors.
  
  const explicitTheme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

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
              colorScheme="dark" // We can force dark mode colors or use 'light'/'dark'
              theme={explicitTheme}
              fontSize={14}
              blockSize={12}
              blockMargin={4}
              style={{
                color: 'var(--foreground)'
              }}
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
