export type ProjectSection = {
  heading: string;
  paragraphs: string[];
};

export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  role: string;
  image: string;
  /** Optional. Use "video" for 16:9 screenshots that should not be cropped into the wide case-study frame. */
  detailImageAspect?: "wide" | "video";
  /** Optional. Omit / leave empty for private prototypes. UI hides the link. */
  githubUrl?: string;
  /** Optional. Omit / leave empty if not deployed yet. UI hides the link. */
  liveUrl?: string;
  featured: boolean;
  /** One-line positioning shown above the section list on the case study page. */
  summary: string;
  /** Highlight numbers shown as a small stat row at the top of the case study. */
  metrics?: ProjectMetric[];
  /** Structured case study body. Each section renders as a heading + paragraphs. */
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    id: "0",
    slug: "tripmates",
    title: "Tripmates",
    shortDescription:
      "A group-travel marketplace for India where solo travellers join curated trips with verified hosts, fixed dates, and pre-booked hotels at unbeatable per-seat prices.",
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "shadcn/ui"],
    role: "Founder & Builder",
    image: "/projects/tripmates.jpg",
    detailImageAspect: "video",
    githubUrl: "https://github.com/anmolmalhan/tripmates",
    liveUrl: "https://tripmates-coral.vercel.app/",
    featured: true,
    summary:
      "Replacing the friend-group coordination loop with a marketplace of pre-curated trips you can join with one seat.",
    metrics: [
      { label: "Status", value: "Frontend-complete prototype" },
      { label: "Target market", value: "India · solo travellers" },
      { label: "Avg. saving vs DIY", value: "~30%" },
    ],
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Every group trip you try to plan with friends gets killed by excuses: mismatched leaves, mismatched budgets, mismatched commitment. Solo travellers who want company end up either traveling alone or coordinating with strangers on noisy WhatsApp groups with no accountability.",
          "Tripmates is built around one observation: the coordination loop is the bottleneck, not the desire. Remove the loop and the trip happens.",
        ],
      },
      {
        heading: "The Product",
        paragraphs: [
          "A curated catalogue of trips that already have fixed dates, pre-booked hotels, and a verified host. You browse, you book a seat, you go. No planning, no chasing, no convincing.",
          "The current build is frontend-complete: a homepage that pitches the value (travel together, make friends, save ~30%), a trip listings grid with day-by-day itineraries, host-verification and trust-and-safety pages, and a seat-based booking flow that drops users into a WhatsApp group on confirmation.",
        ],
      },
      {
        heading: "Why Backend-Agnostic First",
        paragraphs: [
          "Deliberately no database, no real payments yet. The hardest questions for a marketplace like this aren't technical: they're whether real users trust a stranger-host enough to wire money, whether per-seat pricing reads as fair, and whether the WhatsApp handoff feels safe.",
          "By keeping the prototype backend-light, I can iterate on those flows with real users in days, not sprints. Phase 1 wires up Clerk for auth, Neon Postgres for trip data, and Razorpay for payments only once the trust and pricing flows are validated.",
        ],
      },
      {
        heading: "Stack & Engineering Choices",
        paragraphs: [
          "Next.js 16 with the App Router, Server Components, and Turbopack. TypeScript in strict mode. Tailwind v4 with a shadcn/ui Nova preset for a consistent design system. The catalogue is statically generated where possible so listing pages stay sub-second even on Indian mid-tier devices.",
        ],
      },
      {
        heading: "Outcomes & Roadmap",
        paragraphs: [
          "Where it landed: a frontend-complete prototype that walks a real user end-to-end from landing page through host verification, trip selection, day-by-day itinerary, seat-based booking, and a WhatsApp-group handoff on confirmation. Every flow is interactive; nothing is a dead Figma mock.",
          "What I'm validating next: whether per-seat pricing reads as fair to the target user, whether the WhatsApp-group reveal feels safe, and how many seats convert from view to booking before any paid acquisition. Phase 1 then wires Clerk for auth, Neon Postgres for persistent trip data, and Razorpay for payments only after those conversions hold up.",
          "If you want to walk the flows: the live prototype runs without an account, no card required.",
        ],
      },
    ],
  },
  {
    id: "1",
    slug: "speedometx",
    title: "SPEEDOMETX",
    shortDescription:
      "A brutally fast, high-precision edge network telemetry dashboard with fluid Framer Motion kinematics.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    role: "Full-stack Engineer",
    image: "/projects/speedometx.png",
    detailImageAspect: "video",
    githubUrl: "https://github.com/anmolmalhan/Speedometx",
    liveUrl: "https://speedometx.vercel.app/",
    featured: true,
    summary:
      "A network speed test that competes on motion fidelity, not just numbers. Saturating the link without dropping a frame on the gauge.",
    metrics: [
      { label: "Status", value: "Public" },
      { label: "Render budget", value: "60fps gauge under load" },
      { label: "Concurrency", value: "Pooled HTTP workers" },
    ],
    sections: [
      {
        heading: "The Goal",
        paragraphs: [
          "Most browser-based speed tests measure the bottleneck of their own measurement code, not your link. They run on a single TCP connection, share the main thread with the rendering loop, and produce numbers that lag behind reality.",
          "SPEEDOMETX is engineered from the ground up to bypass those bottlenecks, and to look good doing it.",
        ],
      },
      {
        heading: "How It Measures",
        paragraphs: [
          "A high-concurrency upload engine pools multithreaded HTTP workers to saturate modern TCP stacks the way a real workload would. Latency jitter is sampled natively against edge nodes rather than against a single distant origin, so the readout reflects what the user's network actually feels like under sustained load.",
        ],
      },
      {
        heading: "Why Motion Matters Here",
        paragraphs: [
          "A speed test is one of the rare apps where the user stares at a single animating component for the entire session. If the gauge stutters while the link is being saturated, the tool feels slow, even if its numbers are correct.",
          "Framer Motion drives the kinematics with spring physics tuned to feel weighty without lag. The dark, immersive interface keeps focus on the gauge, and the rendering path is structured so the upload engine never starves the animation frame.",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "Next.js with the App Router, TypeScript in strict mode, Tailwind for utility-first styling, and Framer Motion for the gauge and transitions.",
        ],
      },
      {
        heading: "Outcomes & What I Took Away",
        paragraphs: [
          "Where it landed: a public, working speed-test app where the gauge holds a steady 60fps while the upload engine saturates the link. The visible jitter and download numbers track real edge-node behavior rather than a smoothed average, which is the differentiator vs. consumer tests.",
          "What it taught me: rendering budgets are a first-class constraint, not an afterthought. The biggest win came from making sure the measurement workers and the animation frame never compete for the same thread, which sounds obvious until you actually instrument it. Useful pattern I'll reach for again on any data-heavy live-updating UI.",
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "swift-digital-seva",
    title: "Swift Digital Seva",
    shortDescription:
      "A WhatsApp-first digital seva platform for India: government form filling, photo/signature fixes, and PDF tools with upfront pricing, delivery proof, and a Sarkari Result traffic engine.",
    techStack: ["Next.js 16", "TypeScript", "Hono", "Drizzle ORM"],
    role: "Founder & Full-stack Engineer",
    image: "/projects/swift-digital-seva.png",
    detailImageAspect: "video",
    githubUrl: "https://github.com/anmolmalhan/Client-Work-OS",
    liveUrl: "https://client-work-os.vercel.app/",
    featured: true,
    summary:
      "Turning India's sarkari-form anxiety into a paid, proof-backed WhatsApp workflow: price confirmed first, form filled in minutes, proof on delivery.",
    metrics: [
      { label: "Status", value: "Live" },
      { label: "Positioning", value: "Forms from ₹49 on WhatsApp" },
      { label: "Architecture", value: "Bun + Turborepo monorepo" },
    ],
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Millions of Indians apply for government jobs, exams, and schemes every year through portals that fight them at every step: confusing forms, strict photo and signature size rules, payment failures, and deadlines that punish mistakes. Most applicants either risk an error or depend on a local cyber café.",
          "The interface everyone already trusts is WhatsApp. Swift Digital Seva meets users there: send your documents in the chat you already know, and get the form filled correctly, same day, with proof.",
        ],
      },
      {
        heading: "The Product",
        paragraphs: [
          "Government forms filled in about 15 minutes, from ₹49, entirely over WhatsApp. The price is confirmed before any work starts, documents are used only for the requested job and deleted after, and every completed task ships with delivery proof: the confirmation PDF, application number, or receipt.",
          "The public site backs the chat with everything a cautious first-time customer needs: supported services and pricing, step-by-step guides, a Sarkari Result section, a request-submission form that hands off to WhatsApp, and request-ID tracking for work in progress.",
        ],
      },
      {
        heading: "From Client Work OS to Swift Digital Seva",
        paragraphs: [
          "This project started as Client Work OS, a general-purpose operating system for WhatsApp-based client work: requests, payments, documents, and delivery tracking. The platform worked, but the positioning was broad and the audience abstract.",
          "The rebrand sharpened it into one hero use-case with real search demand: sarkari form filling. The name change matters too, because \"seva\" (service) is the vocabulary of the market it serves, and the whole identity now leads with trust: clear pricing, delivery proof, and documents deleted after the job.",
        ],
      },
      {
        heading: "The Growth Engine",
        paragraphs: [
          "\"Sarkari result\" and its long-tail variants draw tens of millions of searches a month in India. The strategy is not to win the head term but the long tail: fast, clean, mobile-first pages for results, admit cards, and how-to-fill guides, each one funneling readers into a one-tap WhatsApp CTA: \"Don't want to risk a mistake? We'll fill it for ₹149.\"",
          "That turns content into customer acquisition: free recurring search demand feeding a paid micro-service, a channel the established form-filling competitors don't have.",
        ],
      },
      {
        heading: "Architecture",
        paragraphs: [
          "The project is built as a Bun workspace monorepo with a Next.js web app, a Hono API service, shared domain packages, typed environment validation, and a Drizzle PostgreSQL schema. The shared domain layer owns services, pricing, statuses, schemas, and formatting helpers so the website, admin UI, and API stay aligned.",
          "The admin workspace mirrors the real back-office flow: request stats, filters, payment status, document context, notes, and delivery tracking, all designed around how the work actually moves, with a document check first, price confirmation second, and payment and delivery once the scope is clear.",
        ],
      },
      {
        heading: "Trust Design",
        paragraphs: [
          "The UX is built for non-technical users sending sensitive documents like Aadhaar to a website they found an hour ago. Every promise is made visible before the chat starts: the price is confirmed first, documents are kept safe and deleted after the job, and proof of delivery is guaranteed.",
          "The product is not trying to replace WhatsApp. It is trying to make the business behind the WhatsApp chat feel organized, accountable, and safe to pay.",
        ],
      },
      {
        heading: "Outcomes & Roadmap",
        paragraphs: [
          "Where it landed: a live, rebranded platform covering the full customer journey from search or referral through service discovery, WhatsApp handoff, request tracking, and admin-side management.",
          "What comes next: a custom domain, real testimonials and delivery-proof samples on the homepage, service bundles to raise order value, a daily-updated Sarkari Result engine with structured data, and WhatsApp Business automation for instant replies and status checks.",
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "match-tracker",
    title: "Match Tracker",
    shortDescription:
      "A head-to-head win tracker for any game or tournament, from chess to carrom to FIFA. Sign in with GitHub, invite a friend with a 4-digit code, and every result counts only once the other player confirms it.",
    techStack: ["Next.js 16", "Hono", "Better Auth", "Drizzle ORM"],
    role: "Founder & Full-stack Engineer",
    image: "/projects/match-tracker.png",
    detailImageAspect: "video",
    githubUrl: "https://github.com/anmolmalhan/Tournament-Score-Tracker",
    liveUrl: "https://tournament-score-tracker-web.vercel.app",
    featured: true,
    summary:
      "Settling head-to-head bragging rights on a shared scoreboard instead of in the group chat, where no win counts until the other player confirms it.",
    metrics: [
      { label: "Status", value: "Live" },
      { label: "Sign-in", value: "GitHub only" },
      { label: "Architecture", value: "Bun + Turborepo monorepo" },
    ],
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Every friend group that plays anything competitively runs into the same argument: who is actually winning. Chess, carrom, FIFA, cricket in the parking lot. The score lives in someone's memory or scattered across a group chat, and it is always disputed. One person swears the tally is four to one; the other is certain it is three all. There is no source of truth, so the bragging rights never settle.",
          "Match Tracker exists to end that argument. It gives casual head-to-head rivalries a proper scoreboard, one that both players trust because neither can quietly edit it.",
        ],
      },
      {
        heading: "The Product",
        paragraphs: [
          "You sign in with GitHub, so your identity is simply your GitHub username and avatar, with no passwords and no guest accounts to muddy who played whom. You start a tournament for whatever you are competing at, name the game, and set a target score. Your opponent joins by typing a 4-digit code, so there are no long invite links to copy and paste on a phone.",
          "From there the loop is deliberately small. You claim a win, your opponent confirms it, and the tally updates. Every player carries lifetime stats across tournaments, including win rate, matches won and lost, and titles taken. Optional push notifications through ntfy ping you when a result is waiting on your confirmation or when a tournament is decided. The whole thing is built mobile-first, for the phone in your hand while you are still at the table.",
        ],
      },
      {
        heading: "Fairness by Design",
        paragraphs: [
          "The core rule is that a win only counts after the other player confirms it. You can never confirm your own claim, and no one can edit a score alone. That single constraint is what makes the scoreboard trustworthy: it is not one person's word against another's, it is a mutually agreed record.",
          "Tournaments are private by default. Only the invited GitHub users can view or play; everyone else is locked out. Owners keep full control to fix a miscount, request a reset, start a rematch, or delete a tournament outright, but none of those actions can rewrite a confirmed result behind an opponent's back.",
        ],
      },
      {
        heading: "Architecture",
        paragraphs: [
          "Match Tracker is a Bun and Turborepo monorepo split into a Next.js 16 web app and a Hono API service, backed by a Drizzle schema on Neon Postgres, with GitHub-only login handled by Better Auth. Both halves deploy independently to Vercel, and database migrations run automatically on the API build.",
          "The most interesting problem was authentication across two subdomains. With the web and API living on separate vercel.app hosts, first-party login cookies would be treated as third-party and blocked by the browser. The fix is a same-origin proxy: the browser only ever talks to the web origin, and the web app proxies every /api request through to the API. Better Auth is configured to match, so the login cookie stays first-party and GitHub sign-in works reliably in production.",
        ],
      },
      {
        heading: "Outcomes & Roadmap",
        paragraphs: [
          "Where it landed: a live product covering the full loop from GitHub sign-in through creating a tournament, inviting a friend by code, claiming and confirming results, and tracking lifetime stats, all backed by a real two-service deployment and a managed Postgres database.",
          "What comes next: richer stats and head-to-head history between specific rivals, leaderboards across a friend group, and more tournament formats beyond simple first-to-target races.",
        ],
      },
    ],
  },
];
