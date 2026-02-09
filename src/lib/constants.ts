export const SITE = {
  name: "Ernest Hysa",
  title: "Ernest Hysa | Full-Stack Developer",
  tagline: "Full-Stack Developer. AI Enthusiast. Builder.",
  url: "https://ernesthysa.github.io",
  email: "ernestohysa94@gmail.com",
  github: "https://github.com/ErnestHysa",
  linkedin: "https://www.linkedin.com/in/ernesthysa",
};

export const ABOUT_TEXT =
  "I'm a full-stack developer who builds across the entire stack — from React and Next.js web apps to React Native mobile apps, Python automation systems, and AI-powered tools. I've shipped 40+ projects spanning ride-hailing platforms, educational tools, LLM benchmarking, and more. I believe the fastest way to learn is to build, and I build a lot.";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export type Project = {
  name: string;
  description: string;
  tech: string[];
  github: string;
  category: "Web App" | "Mobile" | "CLI" | "AI/ML" | "Game";
  featured?: boolean;
  learnings: string;
};

export const PROJECTS: Project[] = [
  {
    name: "LLM Benchmark Comparison",
    description:
      "Interactive platform for comparing AI model performance with real tasks, hybrid scoring (AI + human), side-by-side visualizations, and leaderboards.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS v4"],
    github: "https://github.com/ErnestHysa/LLM-Benchmark-Comparison",
    category: "AI/ML",
    featured: true,
    learnings:
      "Learned how to design fair, reproducible benchmarks — normalizing scores across providers with different APIs was tricky. Had to build a hybrid scoring system because pure AI evaluation was inconsistent. The hardest part was handling concurrent API calls with timeouts while keeping the UI responsive.",
  },
  {
    name: "Kos Taxi App",
    description:
      "Full-stack ride-hailing platform with real-time booking, driver management, Stripe payments, Sentry observability, and full CI/CD pipeline.",
    tech: ["React", "Flask", "Stripe", "PostgreSQL"],
    github: "https://github.com/ErnestHysa/kos-taxi-app",
    category: "Web App",
    featured: true,
    learnings:
      "First time integrating Stripe payment intents end-to-end — handling webhook reliability and idempotency was harder than expected. Building the driver/rider state machine (available → assigned → in-progress → completed) taught me a lot about managing complex state transitions on both frontend and backend.",
  },
  {
    name: "Educational PDF Generator",
    description:
      "API service that generates educational worksheet PDFs with AI-powered content, designed for children with special educational needs.",
    tech: ["Python", "AI Integration", "PDF Generation"],
    github: "https://github.com/ErnestHysa/educational-pdf-generator",
    category: "AI/ML",
    learnings:
      "PDF generation from scratch (no third-party runtime deps) was a deep dive into the PDF spec. Learned to balance AI creativity with educational accuracy — the model needed careful prompt engineering to produce age-appropriate, pedagogically sound content.",
  },
  {
    name: "Holos",
    description:
      "Cross-platform mobile application built with Flutter and Dart for holistic life management and personal wellness tracking.",
    tech: ["Dart", "Flutter"],
    github: "https://github.com/ErnestHysa/holos",
    category: "Mobile",
    learnings:
      "My first Flutter project — coming from React Native, the widget tree and state management patterns (Provider/Riverpod) were a big shift. Learned to appreciate Flutter's build system and hot reload, but debugging platform-specific issues on both iOS and Android simultaneously was challenging.",
  },
  {
    name: "Claude Bridge",
    description:
      "Telegram bot that bridges Claude Code CLI with mobile messaging, featuring multi-agent coordination, persistent memory, autonomous AI decision-making, and self-healing test systems.",
    tech: ["TypeScript", "Telegram API", "SQLite", "Claude API"],
    github: "https://github.com/ErnestHysa/claude-bridge-native-cli",
    category: "AI/ML",
    learnings:
      "Building a multi-agent system (Scout, Builder, Reviewer, Tester, Deployer) from scratch taught me about agent coordination and task scheduling. The hardest problem was designing the autonomous decision engine — balancing when the system should act on its own vs. ask for user approval.",
  },
  {
    name: "Parallel Story Builder",
    description:
      "Collaborative storytelling app for couples with turn-based chapters, AI-assisted writing via Gemini, real-time sync, and themed story templates.",
    tech: ["React Native", "Supabase", "Gemini AI", "Expo"],
    github: "https://github.com/ErnestHysa/ParallelStoryBuilder",
    category: "Mobile",
    learnings:
      "Real-time sync between two users was the core challenge — Supabase's realtime subscriptions required careful conflict resolution for simultaneous edits. Integrating Gemini AI for writing suggestions while keeping the creative voice consistent across both users' styles was an interesting UX problem.",
  },
];

export type SkillCategory = {
  title: string;
  skills: string[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["Python", "TypeScript", "JavaScript"],
  },
  {
    title: "Frameworks",
    skills: ["React", "Next.js", "React Native", "Flask", "Expo"],
  },
  {
    title: "Tools & Platforms",
    skills: ["Git/GitHub", "Supabase", "PostgreSQL", "Stripe", "Linux/Shell"],
  },
  {
    title: "AI & Automation",
    skills: [
      "OpenRouter",
      "Gemini AI",
      "Claude API",
      "Selenium",
      "Web Scraping",
      "LLM Benchmarking",
    ],
  },
  {
    title: "Also Worked With",
    skills: ["Dart/Flutter", "C++", "PHP", "NativeWind"],
  },
];

export const STATS = [
  { value: 42, suffix: "+", label: "Projects Built" },
  { value: 6, suffix: "+", label: "Languages Used" },
  { value: 5, suffix: "+", label: "Years on GitHub" },
  { value: 10, suffix: "+", label: "AI/LLM Projects" },
];

export const ORBIT_SKILLS = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "AI/LLM",
  "Flutter",
  "PostgreSQL",
  "Node.js",
];

// Replace with your Formspree form ID after creating an account at formspree.io
export const FORMSPREE_ID = "YOUR_FORM_ID";
