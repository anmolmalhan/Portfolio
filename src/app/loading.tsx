export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="font-mono text-sm text-[var(--syntax-comment)] flex items-center gap-3">
        <div className="w-2 h-2 bg-[var(--syntax-green)] rounded-full animate-pulse" />
        <span>[booting] compiling route...</span>
        <span className="inline-block w-2 h-4 bg-foreground/50 animate-pulse" />
      </div>
    </div>
  );
}
