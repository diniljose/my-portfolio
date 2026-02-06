# Folio — Modern Portfolio Platform

> **Design vibe:** Apple-like minimal + Vercel marketing precision. 2026 aesthetic.

A production-ready, data-driven portfolio platform built with **Angular 19**. Create unlimited portfolio sites by swapping a single JSON config — zero UI code changes needed.

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Development server
ng serve
# → http://localhost:4200

# Production build
ng build
# → dist/folio/

# Preview a different profile
# → http://localhost:4200/p/dinil
# → http://localhost:4200/p/sarah
```

---

## 🏗 Architecture Overview

```
Frontend-only mode (default)
┌──────────────────────────────┐
│  Angular 19 SPA              │
│  ┌────────┐  ┌────────────┐  │
│  │ Router │→ │ ProfileSvc │──│──→ assets/profiles/<slug>.json
│  └────────┘  └────────────┘  │
│  ┌────────┐  ┌────────────┐  │
│  │ Theme  │  │  Search    │  │
│  │ Service│  │  Service   │  │
│  └────────┘  └────────────┘  │
└──────────────────────────────┘
```

**Switch to backend mode** by changing `environment.ts`:
```ts
dataMode: 'api',      // instead of 'local'
apiUrl: 'http://localhost:3000/api',
```

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces (PortfolioData, Profile, etc.)
│   │   └── services/        # ProfileService, ThemeService, SearchService, SeoService
│   ├── shared/
│   │   └── components/      # Reusable UI: ThemeSwitch, CommandPalette, SectionHeader,
│   │                        #   ProjectCard, Timeline, SkillGrid
│   ├── layout/              # PortfolioLayoutComponent (navbar + footer + router-outlet)
│   ├── pages/               # Home, About, Projects, ProjectDetail, Experience,
│   │                        #   Skills, Resume, Contact
│   ├── app.routes.ts        # Lazy-loaded routes under /p/:slug/*
│   ├── app.config.ts        # Providers (router, HTTP, view transitions)
│   └── app.component.ts     # Root shell + Ctrl+K command palette
├── assets/
│   └── profiles/            # JSON data files — one per person
│       ├── dinil.json
│       └── sarah.json
├── environments/            # environment.ts / environment.prod.ts
└── styles.scss              # Global design system (variables, typography, grid, animations)
```

---

## 🎨 Design System

### Theme Presets

| Preset | Accent | Vibe |
|--------|--------|------|
| **Midnight** | Indigo `#818cf8` | Deep dark, developer-focused |
| **Pearl** | Neutral `#e4e4e7` | Minimal, Apple-like |
| **Sunset** | Orange `#fb923c` | Warm, creative |

Each has **dark** and **light** mode variants. Theme persists in localStorage.

### Switching themes
- Click the **sun/moon icon** in the navbar to toggle dark/light
- Click the **colored dots** to switch presets
- Per-profile override: set `"theme": "sunset"` in the profile JSON

### Typography
- Display: `clamp(2.5rem, 5vw, 4.5rem)` @ weight 800
- H1-H4: Scaled with `clamp()`
- Body: Inter, 1rem, line-height 1.7
- Mono: JetBrains Mono for code/technical text

### CSS Variables
All colors, shadows, and spacing are CSS custom properties. See `styles.scss`.

---

## 📋 Data Model

Defined in `src/app/core/models/portfolio.types.ts`:

```typescript
interface PortfolioData {
  profile: Profile;       // name, headline, summary, location, socials, availability
  skills: Skill[];        // name, category, level (1-5), tags
  experience: Experience[];  // company, role, dates, achievements, technologies
  projects: Project[];    // title, slug, techStack, highlights, caseStudy (markdown)
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
}
```

---

## 🧑‍💻 How to Add a New Person's Portfolio

### 1. Create the JSON file

```bash
cp src/assets/profiles/dinil.json src/assets/profiles/john.json
```

### 2. Edit the JSON
Replace all fields with the new person's data. The schema is documented in `portfolio.types.ts`.

### 3. Add project images (optional)
Place images in `src/assets/images/john/` and reference them in the JSON:
```json
"thumbnail": "assets/images/john/project-thumbnail.jpg"
```

### 4. Set a theme (optional)
```json
"profile": {
  ...
  "theme": "sunset"
}
```

### 5. Access the portfolio
Navigate to: `http://localhost:4200/p/john`

### 6. Set as default (optional)
In `src/environments/environment.ts`:
```ts
defaultProfile: 'john',
```

---

## 🚀 Features

### Core
- ✅ **Multi-profile routing** — `/p/:slug` loads any profile
- ✅ **Data-driven** — change JSON, not code
- ✅ **3 theme presets** with dark/light modes
- ✅ **Lazy-loaded routes** — each page is a separate chunk
- ✅ **View Transitions API** — smooth page transitions
- ✅ **Signals-based state** — Angular 19 signals, no heavy state library
- ✅ **Standalone components** — no NgModules

### UI/UX
- ✅ **Command palette** (Ctrl+K) — search projects, skills, experience
- ✅ **Responsive** — mobile-first with fluid typography
- ✅ **Glass cards** with subtle backdrop blur
- ✅ **Staggered entrance animations**
- ✅ **Project cards** with category filters and search
- ✅ **Experience timeline** with achievement bullets
- ✅ **Skill grid** with level bars and category filters
- ✅ **Print-ready resume** page

### SEO & Accessibility
- ✅ **SEO service** — dynamic `<title>`, meta, OpenGraph, Twitter Card
- ✅ **JSON-LD** support
- ✅ **Skip navigation** link
- ✅ **ARIA labels** on interactive elements
- ✅ **Keyboard navigation** support
- ✅ **Focus-visible** outlines

### Content
- ✅ **Markdown rendering** for project case studies (via `marked`)
- ✅ **Configurable social links**
- ✅ **Contact form** with honeypot spam protection + mailto fallback

---

## 🛠 Commands

```bash
# Dev server
ng serve

# Production build
ng build

# Lint (if configured)
ng lint

# Run unit tests
ng test
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `@angular/core@19` | Framework |
| `@angular/cdk@19` | CDK utilities (overlay, a11y) |
| `marked` | Markdown → HTML for case studies |

**No heavy UI library.** All components are hand-built with CSS variables.

---

## 🔮 Extending

### Add a backend
1. Create a NestJS API with endpoints: `GET /api/profiles/:slug`
2. Return the same `PortfolioData` shape
3. Set `environment.dataMode = 'api'` and `environment.apiUrl`

### Add i18n
The architecture is i18n-ready. Add Angular's `@angular/localize` and create translation files for `de`, etc.

### Add analytics
Plug in any analytics by hooking into the router events in `app.component.ts`:
```ts
this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(event => {
  // gtag('event', 'page_view', { page_path: event.urlAfterRedirects });
});
```

---

## License

MIT
