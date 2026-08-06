/**
 * A real terminal transcript, rendered as text rather than captured as an image.
 *
 * Every command in this post produces output worth showing, and screenshots of
 * a terminal are the worst possible way to ship it: they are unreadable on a
 * phone, they cannot be copied, they carry whatever theme the author happened
 * to be using, and they bloat the page. Text costs nothing, stays crisp at any
 * zoom, and recolours itself with the site theme.
 *
 * Lines beginning with "$ " are treated as the typed command and get the prompt
 * treatment; "#" comments dim; everything else is output.
 */
export function Terminal({
  title = "zsh",
  children,
}: {
  title?: string;
  children: string;
}) {
  const lines = children.replace(/\n+$/, "").split("\n");

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="ml-1 font-mono text-xs text-muted-foreground">{title}</span>
      </div>

      <pre className="overflow-x-auto p-4 md:p-5 text-[13px] leading-relaxed">
        <code className="font-mono">
          {lines.map((line, i) => {
            const isCommand = line.startsWith("$ ");
            const isComment = line.trimStart().startsWith("#");

            return (
              <span key={i} className="block whitespace-pre">
                {isCommand ? (
                  <>
                    <span className="select-none text-[var(--syntax-green)]">$ </span>
                    <span className="text-foreground">{line.slice(2)}</span>
                  </>
                ) : (
                  <span className={isComment ? "text-[var(--syntax-comment)]" : "text-muted-foreground"}>
                    {line || " "}
                  </span>
                )}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
