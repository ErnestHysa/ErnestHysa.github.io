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
};

export const PROJECTS: Project[] = [
  {
    name: "LLM Benchmark Comparison",
    description:
      "Interactive tool comparing AI model performance across benchmarks with data visualizations.",
    tech: ["TypeScript", "Data Visualization"],
    github: "https://github.com/ErnestHysa/LLM-Benchmark-Comparison",
    category: "AI/ML",
    featured: true,
  },
  {
    name: "Kos Taxi App",
    description:
      "Full-stack ride-hailing platform with real-time booking, driver management, and Stripe payments.",
    tech: ["React", "Flask", "Stripe", "PostgreSQL"],
    github: "https://github.com/ErnestHysa/kos-taxi-app",
    category: "Web App",
    featured: true,
  },
  {
    name: "Educational PDF Generator",
    description:
      "AI-powered tool that generates engaging, interactive PDF lessons for children with special educational needs.",
    tech: ["Python", "AI Integration", "PDF Generation"],
    github: "https://github.com/ErnestHysa/educational-pdf-generator",
    category: "AI/ML",
  },
  {
    name: "Holos",
    description:
      "Cross-platform mobile application built with Flutter and Dart for holistic life management.",
    tech: ["Dart", "Flutter"],
    github: "https://github.com/ErnestHysa/holos",
    category: "Mobile",
  },
  {
    name: "Claude Bridge CLI",
    description:
      "CLI bridge for Claude API integration, enabling seamless AI-powered workflows from the terminal.",
    tech: ["TypeScript", "CLI", "Claude API"],
    github: "https://github.com/ErnestHysa/claude-bridge-native-cli",
    category: "CLI",
  },
  {
    name: "Parallel Story Builder",
    description:
      "Collaborative AI-powered storytelling app where multiple users create branching narratives in real-time.",
    tech: ["React Native", "Supabase", "Gemini AI"],
    github: "https://github.com/ErnestHysa/ParallelStoryBuilder",
    category: "Mobile",
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
