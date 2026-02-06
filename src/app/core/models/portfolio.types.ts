// ─── Portfolio Data Schema ───────────────────────────────────────────────────
// All types for the data-driven portfolio system.
// Change JSON data, not UI code.

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'email' | 'website' | 'whatsapp' | 'dribbble' | 'youtube' | 'medium' | 'stackoverflow' | 'other';
  url: string;
  label?: string;
  icon?: string;
}

export interface Profile {
  slug: string;
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  avatar?: string;
  coverImage?: string;
  location: string;
  availability: 'available' | 'busy' | 'not-available';
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  socials: SocialLink[];
  resumeUrl?: string;
  theme?: ThemePreset;
  locale?: 'en' | 'de';
}

export interface Skill {
  name: string;
  category: SkillCategory;
  level: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  icon?: string;
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'database'
  | 'testing'
  | 'tools'
  | 'design'
  | 'cloud'
  | 'other';

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string; // ISO date
  endDate?: string;  // ISO date, null = present
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  role: string;
  techStack: string[];
  highlights: string[];
  links: ProjectLink[];
  images: string[];
  thumbnail?: string;
  featured: boolean;
  caseStudy?: string; // Markdown content
  startDate?: string;
  endDate?: string;
}

export interface ProjectLink {
  type: 'live' | 'github' | 'demo' | 'docs' | 'other';
  url: string;
  label: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
  location?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
  badge?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar?: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
}

// ─── Theme ──────────────────────────────────────────────────────────────────

export type ThemePreset = 'midnight' | 'pearl' | 'sunset';
export type ThemeMode = 'dark' | 'light';

export interface ThemeConfig {
  preset: ThemePreset;
  mode: ThemeMode;
}

// ─── Search ─────────────────────────────────────────────────────────────────

export interface SearchResult {
  type: 'project' | 'skill' | 'experience' | 'education';
  title: string;
  subtitle: string;
  route: string;
  icon: string;
}

// ─── Environment Config ─────────────────────────────────────────────────────

export interface AppEnvironment {
  production: boolean;
  dataMode: 'local' | 'api';
  apiUrl?: string;
  defaultProfile: string;
  defaultTheme: ThemePreset;
  defaultLocale: 'en' | 'de';
  analyticsId?: string;
}
