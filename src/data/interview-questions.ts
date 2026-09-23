import type { InterviewQuestion } from "@/types/interview-prep";

/**
 * Demo interview question bank for CareerOS portfolio.
 * Feedback and scoring elsewhere are simulated — not live AI evaluation.
 */
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q-react-perf",
    prompt: "How would you optimize the performance of a React application?",
    category: "React",
    difficulty: "Medium",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["React", "Performance", "Frontend"],
    hint: "Think about rendering cost, memoization, code splitting, and measuring before optimizing.",
    sampleAnswer:
      "I start by measuring with React Profiler and browser performance tools. Then I reduce unnecessary re-renders with memoization where profiling shows benefit, split heavy routes with lazy loading, stabilize expensive list rendering, and optimize images and network waterfalls. I avoid premature memoization and verify each change with metrics.",
  },
  {
    id: "q-js-closures",
    prompt: "Explain closures in JavaScript and when you would use them.",
    category: "JavaScript",
    difficulty: "Easy",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["JavaScript"],
    hint: "A function retaining access to its lexical scope after the outer function returns.",
    sampleAnswer:
      "A closure is created when an inner function captures variables from an outer scope. I use them for encapsulation, factory functions, event handlers that need private state, and hooks/callback patterns. I am careful with stale closures in async flows and React effects.",
  },
  {
    id: "q-ts-generics",
    prompt: "When would you use TypeScript generics in a frontend codebase?",
    category: "TypeScript",
    difficulty: "Medium",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["TypeScript"],
    hint: "Reuse typed utilities while preserving caller-specific types.",
    sampleAnswer:
      "I use generics for reusable utilities like API clients, form helpers, and list components where the shape of data varies but the behavior is shared. Generics keep type safety without casting, especially for mapped or constrained types.",
  },
  {
    id: "q-next-ssr",
    prompt: "How do you decide between Server Components and Client Components in Next.js?",
    category: "Next.js",
    difficulty: "Medium",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["Next.js", "React"],
    hint: "Default to server; move to client when interactivity or browser APIs are required.",
    sampleAnswer:
      "I keep components as Server Components by default for data fetching and reduced bundle size. I introduce Client Components at the leaves that need state, effects, or browser APIs, and pass data down as props to minimize client JavaScript.",
  },
  {
    id: "q-html-a11y",
    prompt: "What accessibility practices do you follow when building UI?",
    category: "HTML/CSS",
    difficulty: "Easy",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["Accessibility", "HTML/CSS"],
    hint: "Semantics, keyboard support, labels, and contrast.",
    sampleAnswer:
      "I use semantic HTML, ensure keyboard navigation and focus visibility, label controls correctly, manage ARIA only when needed, and check color contrast. I also verify screen-reader announcements for dynamic UI updates.",
  },
  {
    id: "q-api-design",
    prompt: "How would you design a resilient frontend integration with a REST API?",
    category: "APIs",
    difficulty: "Medium",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["APIs", "Frontend"],
    hint: "Caching, error states, retries, and clear loading UX.",
    sampleAnswer:
      "I define typed contracts, handle loading and empty/error states explicitly, use retries for idempotent reads when safe, cache where freshness allows, and surface actionable errors. I also guard against race conditions when requests overlap.",
  },
  {
    id: "q-sd-feed",
    prompt: "Design a high-level architecture for a news feed that supports likes and comments.",
    category: "System Design",
    difficulty: "Hard",
    interviewTypes: ["System Design", "Mixed"],
    tags: ["System Design"],
    hint: "Separate read/write paths, pagination, and realtime fan-out tradeoffs.",
    sampleAnswer:
      "I would separate feed reads from write paths for posts, likes, and comments. Use pagination or cursors for feed retrieval, store engagement counts carefully to avoid hotspots, and consider push vs pull fan-out based on follower scale. Caching and eventual consistency are key tradeoffs to discuss.",
  },
  {
    id: "q-beh-conflict",
    prompt: "Tell me about a time you disagreed with a teammate. How did you handle it?",
    category: "Behavioral",
    difficulty: "Medium",
    interviewTypes: ["Behavioral", "Mixed", "HR"],
    tags: ["Behavioral"],
    hint: "Use STAR: situation, task, action, result — emphasize collaboration.",
    sampleAnswer:
      "In a design-system debate over component API complexity, I clarified goals, proposed a short prototype comparison, and aligned on user impact metrics. We chose the simpler API, documented tradeoffs, and delivery improved without blocking the release.",
  },
  {
    id: "q-beh-project",
    prompt: "Walk me through a project you are proud of and your specific contributions.",
    category: "Behavioral",
    difficulty: "Easy",
    interviewTypes: ["Behavioral", "HR", "Mixed"],
    tags: ["Behavioral", "Projects"],
    hint: "Be specific about ownership, constraints, and measurable outcomes.",
    sampleAnswer:
      "I led the frontend for a dashboard redesign under a tight deadline. I scoped the MVP with design, rebuilt key flows in React, and reduced interaction friction. We shipped on time and improved task completion based on internal feedback.",
  },
  {
    id: "q-hr-motivation",
    prompt: "Why are you interested in this role and company?",
    category: "HR",
    difficulty: "Easy",
    interviewTypes: ["HR", "Behavioral", "Mixed"],
    tags: ["HR"],
    hint: "Connect company mission and role responsibilities to your experience.",
    sampleAnswer:
      "I am drawn to teams that ship high-craft product experiences. This role aligns with my frontend strengths in React and design systems, and I want to contribute where product quality and collaboration are valued.",
  },
  {
    id: "q-react-hooks",
    prompt: "Explain how you avoid stale state bugs when using React hooks.",
    category: "React",
    difficulty: "Medium",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["React", "Hooks"],
    hint: "Dependencies, functional updates, and effect cleanup.",
    sampleAnswer:
      "I keep effect dependencies accurate, prefer functional state updates for values derived from previous state, avoid stale closures in async handlers, and clean up subscriptions. When needed I use refs for mutable latest values without re-rendering.",
  },
  {
    id: "q-js-event-loop",
    prompt: "Describe the JavaScript event loop and how microtasks differ from macrotasks.",
    category: "JavaScript",
    difficulty: "Hard",
    interviewTypes: ["Technical"],
    tags: ["JavaScript"],
    hint: "Call stack, task queue, and Promise microtask queue.",
    sampleAnswer:
      "JavaScript runs on a single-threaded call stack. Macrotasks like setTimeout enter the task queue, while Promise callbacks are microtasks that flush before the next macrotask. Understanding this helps explain UI jank and ordering bugs in async code.",
  },
  {
    id: "q-css-layout",
    prompt: "How do you approach building responsive layouts with modern CSS?",
    category: "HTML/CSS",
    difficulty: "Easy",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["HTML/CSS"],
    hint: "Fluid layouts, clamp, container queries where useful, and mobile-first breakpoints.",
    sampleAnswer:
      "I design mobile-first with flexible grids and spacing tokens, use clamp for fluid type where appropriate, and prefer logical properties. I test critical breakpoints and avoid brittle pixel layouts.",
  },
  {
    id: "q-sd-auth",
    prompt: "How would you design authentication for a SPA with a separate API?",
    category: "System Design",
    difficulty: "Hard",
    interviewTypes: ["System Design", "Technical"],
    tags: ["System Design", "Security"],
    hint: "Tokens, refresh strategy, XSS/CSRF considerations.",
    sampleAnswer:
      "I prefer short-lived access tokens with a secure refresh strategy, HttpOnly cookies when possible to reduce XSS token theft, CSRF protections for cookie-based auth, and clear session revocation. On the SPA I gate routes and handle 401 refresh flows carefully.",
  },
  {
    id: "q-beh-deadline",
    prompt: "Describe a time you had to deliver under a tight deadline. What tradeoffs did you make?",
    category: "Behavioral",
    difficulty: "Medium",
    interviewTypes: ["Behavioral", "Mixed"],
    tags: ["Behavioral"],
    hint: "Show prioritization and communication, not just heroics.",
    sampleAnswer:
      "We cut non-critical polish, communicated scope changes early, and focused on the user-critical path with feature flags. I documented follow-ups so quality debt was intentional and tracked after launch.",
  },
  {
    id: "q-next-caching",
    prompt: "How does caching work in the Next.js App Router, and when would you opt out?",
    category: "Next.js",
    difficulty: "Hard",
    interviewTypes: ["Technical"],
    tags: ["Next.js"],
    hint: "Static vs dynamic rendering, revalidate, and no-store for user-specific data.",
    sampleAnswer:
      "App Router caching depends on rendering mode and fetch options. I lean on revalidation for mostly-static content and disable caching for personalized or rapidly changing data. I verify cache behavior intentionally rather than assuming defaults.",
  },
  {
    id: "q-hr-strength",
    prompt: "What is your greatest strength as an engineer, and how has it shown up recently?",
    category: "HR",
    difficulty: "Easy",
    interviewTypes: ["HR", "Behavioral"],
    tags: ["HR"],
    hint: "Pick one strength and back it with a concrete example.",
    sampleAnswer:
      "My strength is translating product ambiguity into clear frontend delivery. Recently I clarified requirements for a complex settings flow, proposed a phased UI, and helped the team ship without blocking dependent work.",
  },
  {
    id: "q-api-errors",
    prompt: "How do you communicate API failures clearly in a product UI?",
    category: "APIs",
    difficulty: "Easy",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["APIs", "UX"],
    hint: "Distinguish transient vs permanent failures and offer recovery.",
    sampleAnswer:
      "I map error classes to user-facing messages, offer retry for transient failures, preserve user input, and escalate permanent permission or validation issues with clear next steps. Logging and correlation IDs help debugging without exposing internals.",
  },
  {
    id: "q-ts-unknown",
    prompt: "Why prefer unknown over any when handling untrusted data in TypeScript?",
    category: "TypeScript",
    difficulty: "Easy",
    interviewTypes: ["Technical"],
    tags: ["TypeScript"],
    hint: "unknown forces narrowing before use.",
    sampleAnswer:
      "unknown requires type narrowing before use, which prevents accidental unsafe operations. any disables checking entirely. For API payloads and user input I validate and narrow unknowns into trusted shapes.",
  },
  {
    id: "q-react-state",
    prompt: "How do you decide what state belongs in React local state vs URL vs server state?",
    category: "React",
    difficulty: "Hard",
    interviewTypes: ["Technical", "Mixed"],
    tags: ["React", "Architecture"],
    hint: "Ephemeral UI vs shareable/bookmarkable vs remote source of truth.",
    sampleAnswer:
      "Local state fits ephemeral UI. URL state fits shareable filters and navigation. Server state is the source of truth for remote data with caching. I keep a single source of truth and avoid duplicating server data in unnecessary local copies.",
  },
];

export const QUESTION_CATEGORIES = [
  "Technical",
  "JavaScript",
  "React",
  "Next.js",
  "TypeScript",
  "HTML/CSS",
  "APIs",
  "System Design",
  "Behavioral",
  "HR",
] as const;

export const INTERVIEW_TYPES = [
  "Technical",
  "Behavioral",
  "HR",
  "System Design",
  "Mixed",
] as const;

export const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Junior",
  "Mid Level",
  "Senior",
] as const;
