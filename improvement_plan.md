# Portfolio Improvement Plan — Final (Approved)

> All decisions confirmed through discussion on Feb 9, 2026.

---

## Overview of Decisions

| Area | Decision |
|------|----------|
| **Tagline** | "Full-Stack Developer. AI Enthusiast. Builder." |
| **Skill labels** | Upgraded to evidence-based levels (Proficient/Comfortable/Familiar) |
| **Projects** | 6-8 max, quality over quantity |
| **Hero visual** | Hybrid skill orbit — organic flowing paths, interactive |
| **Navigation** | Scroll-triggered sticky nav (hidden on hero, fades in on scroll) |
| **Stats section** | Yes |
| **Design direction** | Complete redesign → Bento grid layout |
| **Color scheme** | Designer's choice (professional & modern) |
| **Theme** | Dark/light toggle (keep) |
| **Blog** | Skip |
| **Resume** | PDF download button (user provides PDF) |
| **Contact form** | Formspree (user creates account, plugs in form ID) |
| **GitHub widget** | Contribution heatmap graph only |
| **Deployment** | Source code in repo + GitHub Actions auto-build |
| **Build** | Fresh Next.js project from scratch |
| **SEO & Analytics** | Full setup (sitemap, robots.txt, structured data, analytics) |
| **Accessibility** | WCAG AA compliance |
| **LinkedIn** | https://www.linkedin.com/in/ernesthysa |

---

## Architecture: Fresh Next.js + GitHub Actions

### Why rebuild from scratch
The current repo only contains compiled build output (minified HTML/JS/CSS). Editing is impractical. A fresh project gives us:
- Clean, readable source code in the repo
- Automated builds via GitHub Actions (push source → auto-deploys)
- Easy future updates (edit a component, push, done)

### Tech stack
```
Framework:      Next.js 14+ (App Router, static export)
Styling:        Tailwind CSS v4
Language:       TypeScript
Animations:     Framer Motion (for bento card reveals, orbit, transitions)
Hero:           Canvas-based skill orbit (custom, lightweight)
GitHub Graph:   react-github-calendar or custom SVG from GitHub API
Contact Form:   Formspree (POST to their API, site stays static)
Fonts:          Inter (clean, professional) + JetBrains Mono (code accents)
Deployment:     GitHub Actions → GitHub Pages (static export)
```

### Repo structure (new)
```
ErnestHysa.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: build & deploy
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-image.png            # Social sharing card
│   ├── resume.pdf              # User-provided resume
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, meta, theme provider)
│   │   ├── page.tsx            # Main page (assembles all sections)
│   │   └── globals.css         # Tailwind imports + custom properties
│   ├── components/
│   │   ├── Hero.tsx            # Name, tagline, skill orbit
│   │   ├── SkillOrbit.tsx      # Interactive orbit canvas animation
│   │   ├── About.tsx           # About section
│   │   ├── Projects.tsx        # Bento project cards
│   │   ├── Skills.tsx          # Skills grid with proficiency
│   │   ├── Stats.tsx           # Repo count, languages, years
│   │   ├── GitHubGraph.tsx     # Contribution heatmap
│   │   ├── Contact.tsx         # Form + direct links
│   │   ├── Navbar.tsx          # Scroll-triggered sticky nav
│   │   ├── ThemeToggle.tsx     # Dark/light mode switch
│   │   ├── Footer.tsx          # Footer with dynamic year
│   │   └── BentoCard.tsx       # Reusable bento grid card
│   ├── lib/
│   │   └── constants.ts        # Projects data, skills data, links
│   └── hooks/
│       ├── useScrollSpy.ts     # Active section detection
│       └── useTheme.ts         # Theme persistence
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Section-by-Section Design Spec

### 1. Navigation (Navbar.tsx)

**Behavior:**
- Hidden when at top of page (hero is clean)
- Fades in with a subtle slide-down after scrolling past the hero (~100vh)
- Sticky at top of viewport
- Active section highlighted based on scroll position
- On mobile: collapses to hamburger menu

**Style:**
- Thin bar with frosted glass/blur background
- Section links: Home | About | Projects | Skills | Contact
- Resume download button on the right
- Theme toggle integrated into the nav

### 2. Hero Section (Hero.tsx + SkillOrbit.tsx)

**Layout:**
- Full viewport height (100vh)
- Name "Ernest Hysa" large and centered
- Tagline "Full-Stack Developer. AI Enthusiast. Builder." below
- Skill orbit animation behind/around the text
- Subtle scroll indicator at bottom

**Skill Orbit:**
- Canvas-based animation
- Core skills float in organic, flowing orbital paths around the center
- Skills shown: Python, TypeScript, React, Next.js, AI/LLM, Flutter, PostgreSQL
- Paths are slightly different each page load (seeded randomness)
- Interactive: hovering a skill pauses it and shows a tooltip
- Reduced motion: falls back to a static arranged layout
- Light, performant — no heavy 3D libraries

### 3. About Section (About.tsx)

**Content rewrite:**
- Remove "learning journey" framing
- Focus on what you build and ship
- Mention your range: web, mobile, AI, automation
- Keep it concise: 2-3 sentences max
- Tone: confident but genuine (not arrogant)

**Draft:**
> I'm a full-stack developer who builds across the entire stack — from React and Next.js web apps to React Native mobile apps, Python automation systems, and AI-powered tools. I've shipped 40+ projects spanning ride-hailing platforms, educational tools, LLM benchmarking, and more. I believe the fastest way to learn is to build, and I build a lot.

### 4. Stats Section (Stats.tsx)

**Bento card** with animated counters:
- **42+** Projects Built
- **6+** Languages Used
- **5+** Years on GitHub
- **10+** AI/LLM Projects

Style: Numbers animate up on scroll into view. Clean, bold typography.

### 5. Projects Section (Projects.tsx)

**6-8 projects max.** Displayed as bento grid cards of varying sizes.

**Recommended 6 featured projects:**

| # | Project | Why | Tech Tags |
|---|---------|-----|-----------|
| 1 | **LLM Benchmark Comparison** | AI expertise, data viz, timely topic | TypeScript, Data Visualization |
| 2 | **Kos Taxi App** | Full-stack, real-world, payments | React, Flask, Stripe, PostgreSQL |
| 3 | **Educational PDF Generator** | Social impact, AI integration | Python, AI, PDF Generation |
| 4 | **Holos** | Cross-platform mobile, Flutter | Dart, Flutter |
| 5 | **Claude Bridge CLI** | Systems thinking, CLI tools, AI APIs | TypeScript, CLI, Claude API |
| 6 | **Parallel Story Builder** | Creative, real-time, AI-powered | React Native, Supabase, Gemini AI |

**Optional 7th & 8th:**
- Virtual Pet Co-Parent (React Native, Supabase)
- Game Engine (C++, GLFW3) — shows breadth

**Each card includes:**
- Project name and one-line description
- Tech tags as colored pills
- GitHub link button
- Category label (Web App / Mobile / CLI / AI)

**Bento layout:** 2 large cards (spanning 2 columns) + remaining as single-column cards. On mobile: all stack to full width.

### 6. Skills Section (Skills.tsx)

**No progress bars** — they're arbitrary. Instead, use a categorized grid.

**Layout:** Bento cards grouped by category:

**Card 1 — Languages (Proficient):**
Python, TypeScript, JavaScript

**Card 2 — Frameworks (Comfortable):**
React, Next.js, React Native, Flask, Expo

**Card 3 — Tools & Platforms:**
Git/GitHub, Supabase, PostgreSQL, Stripe, Linux/Shell

**Card 4 — AI & Automation:**
OpenRouter, Gemini AI, Claude API, Selenium, Web Scraping, LLM Benchmarking

**Card 5 — Also Worked With:**
Dart/Flutter, C++, PHP, NativeWind

Each skill shown as a clean pill/chip. Proficiency communicated by grouping (top groups = strongest) rather than arbitrary percentage bars.

### 7. GitHub Contribution Graph (GitHubGraph.tsx)

**Bento card** containing:
- Green contribution heatmap grid (past year)
- Fetched from GitHub's public API or via `react-github-calendar`
- Links to full GitHub profile on click
- Adapts colors to current theme (dark/light)

### 8. Contact Section (Contact.tsx)

**Two-part layout:**

**Left card — Contact Form (Formspree):**
- Fields: Name, Email, Message
- Submit button
- Success/error state handling
- Form POSTs to Formspree endpoint (user plugs in their form ID)
- Placeholder: `FORMSPREE_FORM_ID` in constants.ts

**Right card — Direct Links:**
- Email: ernestohysa94@gmail.com
- GitHub: github.com/ErnestHysa
- LinkedIn: linkedin.com/in/ernesthysa
- Each with icon and hover effect

### 9. Footer (Footer.tsx)

- "© {currentYear} Ernest Hysa. Built with Next.js."
- Dynamic year (no more hardcoded 2025)
- Minimal, clean

### 10. Resume Download

- PDF file placed in `/public/resume.pdf`
- Download button in navbar (always visible)
- Also accessible from a link in the contact section
- `<a href="/resume.pdf" download>` — simple static file download

---

## Design System

### Color Palette (Designer's Choice)

Going with a **clean neutral base + single vibrant accent** approach. More sophisticated than gradients, ages better, works in both themes.

**Light mode:**
```
Background:     #FAFAFA (warm white)
Surface:        #FFFFFF (cards)
Text Primary:   #0F172A (slate-900)
Text Secondary: #64748B (slate-500)
Accent:         #6366F1 (indigo-500) — vibrant but professional
Accent Hover:   #4F46E5 (indigo-600)
Border:         #E2E8F0 (slate-200)
```

**Dark mode:**
```
Background:     #0B0F1A (deep navy, not pure black)
Surface:        #151B2B (slightly lighter navy for cards)
Text Primary:   #F1F5F9 (slate-100)
Text Secondary: #94A3B8 (slate-400)
Accent:         #818CF8 (indigo-400) — brighter for dark bg
Accent Hover:   #6366F1 (indigo-500)
Border:         #1E293B (slate-800)
```

**Why indigo:** Professional yet distinctive. Works for both tech and corporate audiences. Not overused like teal-purple gradient combos.

### Typography
```
Headings:   Inter (700 weight) — clean, modern, highly legible
Body:       Inter (400/500) — consistent family
Code/Tech:  JetBrains Mono (400) — for skill tags and tech labels
```

### Bento Grid System
```
Desktop:  4-column grid, 1rem gap
Tablet:   2-column grid
Mobile:   1-column stack

Card sizes:
- Small:  1×1 (single column, single row)
- Medium: 2×1 (spans 2 columns)
- Large:  2×2 (spans 2 columns and 2 rows, hero projects)
- Full:   4×1 (full width, used for hero/contact)
```

### Card Style
```
Background:     theme surface color (no glassmorphism)
Border:         1px solid theme border color
Border Radius:  16px
Padding:        24px
Shadow:         subtle (0 1px 3px rgba(0,0,0,0.05))
Hover:          slight translate-y (-2px) + shadow increase
Transition:     200ms ease
```

Clean, solid cards instead of glassmorphism. More readable, more modern (2025-2026 trend is moving away from glass effects toward clean solids).

---

## SEO & Meta Setup

### Meta tags (layout.tsx)
```
<title>Ernest Hysa | Full-Stack Developer</title>
<meta name="description" content="Full-stack developer building web apps, mobile apps, AI tools, and automation systems with TypeScript, Python, React, and more." />
<meta property="og:title" content="Ernest Hysa | Full-Stack Developer" />
<meta property="og:description" content="Portfolio of Ernest Hysa — full-stack developer, AI enthusiast, and builder." />
<meta property="og:url" content="https://ernesthysa.github.io" />
<meta property="og:image" content="https://ernesthysa.github.io/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="https://ernesthysa.github.io" />
<meta name="theme-color" content="#6366F1" />
```

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://ernesthysa.github.io/sitemap.xml
```

### sitemap.xml
Single page site — simple sitemap with just the root URL.

### Structured Data (JSON-LD)
Person schema with name, url, job title, social links.

### og-image.png
Create a 1200×630 social card with:
- "Ernest Hysa" in large text
- "Full-Stack Developer" subtitle
- Clean design matching site branding

---

## Accessibility (WCAG AA)

| Feature | Implementation |
|---------|---------------|
| Skip to content | `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` as first element |
| Semantic HTML | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` with proper roles |
| Heading hierarchy | Single h1, logical h2/h3 nesting |
| Color contrast | All text meets 4.5:1 ratio against backgrounds (both themes) |
| Focus indicators | Visible focus rings on all interactive elements (2px solid accent, 2px offset) |
| Keyboard navigation | All interactions accessible via keyboard, logical tab order |
| ARIA labels | All icons-only buttons have aria-label, decorative elements have aria-hidden |
| Reduced motion | `prefers-reduced-motion` query disables all animations, orbit shows static layout |
| Form accessibility | Labels linked to inputs, error messages in aria-live regions |
| Alt text | All images have descriptive alt text |
| Touch targets | Minimum 44×44px for all interactive elements |

---

## GitHub Actions Deployment (deploy.yml)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - uses: actions/deploy-pages@v4
```

`next.config.ts` will include `output: 'export'` to generate static files into `./out`.

---

## Implementation Phases

### Phase 1: Project Setup
- Initialize fresh Next.js project with TypeScript + Tailwind
- Set up project structure (components, lib, hooks)
- Configure `next.config.ts` with static export
- Set up GitHub Actions deploy workflow
- Add favicon, robots.txt, sitemap.xml
- Test that empty site deploys to GitHub Pages

### Phase 2: Core Sections
- Build layout.tsx with fonts, meta tags, theme provider
- Build Navbar (scroll-triggered sticky)
- Build Hero with name + tagline (orbit comes in Phase 3)
- Build About section
- Build Footer with dynamic year
- Build ThemeToggle (dark/light persistence)

### Phase 3: Content Sections
- Build Stats section with animated counters
- Build Projects section as bento cards (6-8 projects)
- Build Skills section as categorized grid
- Build GitHubGraph component (contribution heatmap)
- Build Contact section (form + direct links)
- Add resume.pdf and download button

### Phase 4: Polish & Animation
- Build SkillOrbit canvas animation for hero
- Add Framer Motion entrance animations to bento cards
- Add scroll-triggered reveal animations
- Ensure reduced-motion fallbacks work
- Create og-image.png social card

### Phase 5: SEO, Accessibility & Launch
- Add structured data (JSON-LD)
- Run Lighthouse audit, fix any issues
- Test WCAG AA compliance (contrast, keyboard, screen reader)
- Test on mobile devices
- Add analytics (Google Analytics 4 or Plausible)
- Final review and launch

---

## Placeholders for User Input

These need to be provided by the user during implementation:

| Item | Status |
|------|--------|
| Resume PDF file | User will provide |
| Formspree form ID | User creates account at formspree.io |
| Analytics tracking ID | User creates GA4 property or Plausible account |
| Professional photo (optional) | Not required for current design |
| Project screenshots (optional) | Can be added later to enhance project cards |

---

## GitHub Bio Update (Suggested)

**Current:** "I don't know much stuff, I am new to programming language but I think I can learn a lot pretty quickly if it's explainable to the core."

**Suggested:** "Full-stack developer building with TypeScript, Python, and AI. Shipping apps, automations, and tools."

**Also update:**
- Blog URL → https://ernesthysa.github.io
- Location → (add if comfortable)
