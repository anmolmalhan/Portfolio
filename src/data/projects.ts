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
          "The rebrand sharpened it into one hero use-case with real search demand: sarkari form filling. The name change matters too — \"seva\" (service) is the vocabulary of the market it serves, and the whole identity now leads with trust: clear pricing, delivery proof, and documents deleted after the job.",
        ],
      },
      {
        heading: "The Growth Engine",
        paragraphs: [
          "\"Sarkari result\" and its long-tail variants draw tens of millions of searches a month in India. The strategy is not to win the head term but the long tail: fast, clean, mobile-first pages for results, admit cards, and how-to-fill guides — each one funneling readers into a one-tap WhatsApp CTA: \"Don't want to risk a mistake? We'll fill it for ₹149.\"",
          "That turns content into customer acquisition: free recurring search demand feeding a paid micro-service, a channel the established form-filling competitors don't have.",
        ],
      },
      {
        heading: "Architecture",
        paragraphs: [
          "The project is built as a Bun workspace monorepo with a Next.js web app, a Hono API service, shared domain packages, typed environment validation, and a Drizzle PostgreSQL schema. The shared domain layer owns services, pricing, statuses, schemas, and formatting helpers so the website, admin UI, and API stay aligned.",
          "The admin workspace mirrors the real back-office flow: request stats, filters, payment status, document context, notes, and delivery tracking — designed around how the work actually moves: document check first, price confirmation second, payment and delivery after scope is clear.",
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
];
