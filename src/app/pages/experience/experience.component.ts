import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService, SeoService } from '../../core/services';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO — Blueprint / Architectural (NO circles, NO split grid, NO particles) -->
    <section class="exp-hero">
      <!-- Dot matrix background -->
      <div class="hero-dots" aria-hidden="true"></div>
      <!-- Thin crosshatch lines -->
      <div class="hero-grid-lines" aria-hidden="true"></div>
      <!-- Animated circuit paths -->
      <svg class="hero-circuit" aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        <path d="M0 300 H200 L250 250 H450 L500 300 H700 L750 250 H1000 L1050 300 H1200" class="circuit-line cl1"/>
        <path d="M0 200 H150 L200 150 H400 L450 200 H650 L700 150 H900 L950 200 H1200" class="circuit-line cl2"/>
        <path d="M0 400 H250 L300 350 H500 L550 400 H750 L800 350 H1050 L1100 400 H1200" class="circuit-line cl3"/>
        <circle cx="250" cy="250" r="4" class="circuit-node cn1"/>
        <circle cx="500" cy="300" r="4" class="circuit-node cn2"/>
        <circle cx="750" cy="250" r="4" class="circuit-node cn3"/>
        <circle cx="200" cy="150" r="4" class="circuit-node cn4"/>
        <circle cx="700" cy="150" r="4" class="circuit-node cn5"/>
        <circle cx="300" cy="350" r="4" class="circuit-node cn6"/>
        <circle cx="800" cy="350" r="4" class="circuit-node cn7"/>
      </svg>

      <div class="container hero-center">
        <span class="hero-label anim-up" style="--d:0.05s">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          Work Experience
        </span>
        <h1 class="hero-title anim-up" style="--d:0.15s">
          Professional
          <span class="title-highlight">Journey</span>
        </h1>
        <p class="hero-desc anim-up" style="--d:0.25s">
          {{ getYearsOfExperience() }}+ years building enterprise applications — from GovTech
          platforms to healthcare AI systems.
        </p>

        <!-- Career path — Equal company cards -->
        <div class="career-path anim-up" style="--d:0.35s">
          @for (item of profileService.experience(); track item.id; let i = $index) {
            <div class="path-card" [class.is-current]="!item.endDate">
              @if (!item.endDate) {
                <span class="pc-status">Current</span>
              }
              @if (item.company === 'fedo.ai') {
                <span class="pc-badge">Startup</span>
              }
              <h3 class="pc-company">{{ item.company }}</h3>
              <span class="pc-role">{{ item.role }}</span>
              <div class="pc-meta">
                <span class="pc-loc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ item.location }}
                </span>
                <span class="pc-period">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  {{ getYear(item.startDate) }} — {{ item.endDate ? getYear(item.endDate) : 'Present' }}
                  <span class="pc-years">({{ getDuration(item.startDate, item.endDate) }})</span>
                </span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="tl-section section">
      <div class="container">
        @for (item of profileService.experience(); track item.id; let i = $index; let last = $last) {
          <div class="tl-row anim-up" [style.--d]="(i * 0.1 + 0.1) + 's'">
            <div class="tl-date-col">
              <span class="tl-start">{{ formatDate(item.startDate) }}</span>
              <span class="tl-end">{{ item.endDate ? formatDate(item.endDate) : 'Present' }}</span>
            </div>

            <div class="tl-spine">
              <div class="spine-node" [class.active]="i === 0">
                @if (i === 0) { <div class="node-ping"></div> }
              </div>
              @if (!last) { <div class="spine-wire"></div> }
            </div>

            <div class="tl-card" [class.is-current]="i === 0">
              <div class="card-head">
                <div>
                  <h3 class="card-role">{{ item.role }}</h3>
                  <p class="card-company">{{ item.company }}</p>
                </div>
                <span class="card-loc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ item.location }}
                </span>
              </div>

              <p class="card-desc">{{ item.description }}</p>

              @if (item.achievements.length > 0) {
                <div class="card-ach">
                  <span class="ach-label">Key Achievements</span>
                  <ul class="ach-list">
                    @for (a of item.achievements; track a) {
                      <li><span class="ach-bullet"></span>{{ a }}</li>
                    }
                  </ul>
                </div>
              }

              @if (item.technologies.length > 0) {
                <div class="card-tech">
                  @for (tech of item.technologies; track tech) {
                    <span class="tech-chip">{{ tech }}</span>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section section">
      <div class="container">
        <div class="cta-band anim-up" style="--d:0.1s">
          <div class="cta-text">
            <span class="cta-eyebrow">What's Next?</span>
            <h2 class="cta-heading">Let's build something great together</h2>
            <p class="cta-sub">Looking for a senior engineer to drive your next big project?</p>
          </div>
          <div class="cta-actions">
            <a [routerLink]="['/contact']" class="cta-primary">
              Get in Touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a routerLink="/projects" class="cta-ghost">View Projects</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ═══════════════════════════════════
       EXPERIENCE HERO — BLUEPRINT / ARCHITECTURAL
       Single column centered, dot matrix bg,
       career path breadcrumb, NO circles/orbs,
       NO split grid with right-side card
       ═══════════════════════════════════ */
    .exp-hero {
      position: relative;
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 8rem 0 4rem;
      text-align: center;
      background: var(--bg-primary);
    }

    /* Dot matrix pattern */
    .hero-dots {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(rgba(var(--accent-rgb), 0.08) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
    }

    /* Thin crosshatch grid */
    .hero-grid-lines {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(var(--accent-rgb), 0.025) 1px, transparent 1px),
        linear-gradient(0deg, rgba(var(--accent-rgb), 0.025) 1px, transparent 1px);
      background-size: 80px 80px;
      pointer-events: none;
    }

    /* Animated circuit board paths */
    .hero-circuit {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .circuit-line {
      fill: none;
      stroke: rgba(var(--accent-rgb), 0.08);
      stroke-width: 1.5;
      stroke-dasharray: 1200;
      stroke-dashoffset: 1200;
      animation: drawCircuit 4s ease-out forwards;
    }

    .cl1 { animation-delay: 0.2s; }
    .cl2 { animation-delay: 0.6s; stroke: rgba(var(--accent-rgb), 0.06); }
    .cl3 { animation-delay: 1.0s; stroke: rgba(var(--accent-rgb), 0.05); }

    @keyframes drawCircuit {
      to { stroke-dashoffset: 0; }
    }

    .circuit-node {
      fill: var(--accent);
      opacity: 0;
      animation: nodeAppear 0.4s ease-out forwards;
    }

    .cn1 { animation-delay: 1.0s; }
    .cn2 { animation-delay: 1.3s; }
    .cn3 { animation-delay: 1.6s; }
    .cn4 { animation-delay: 1.1s; }
    .cn5 { animation-delay: 1.5s; }
    .cn6 { animation-delay: 1.2s; }
    .cn7 { animation-delay: 1.7s; }

    @keyframes nodeAppear {
      to { opacity: 0.25; }
    }

    .hero-center {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 1.5rem;
    }

    .hero-label svg { width: 14px; height: 14px; }

    .hero-title {
      font-size: clamp(2.5rem, 7vw, 4.5rem);
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.04em;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
    }

    .title-highlight {
      position: relative;
      display: inline-block;
      color: var(--accent);
    }

    .title-highlight::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -4%;
      right: -4%;
      height: 35%;
      background: rgba(var(--accent-rgb), 0.1);
      border-radius: 4px;
      z-index: -1;
      transform: skewX(-3deg);
    }

    .hero-desc {
      font-size: 1.0625rem;
      line-height: 1.7;
      color: var(--text-secondary);
      max-width: 600px;
      margin-bottom: 2.5rem;
    }

    /* ═══ CAREER PATH — EQUAL COMPANY CARDS ═══ */
    .career-path {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      width: 100%;
      max-width: 750px;
    }

    .path-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.375rem;
      padding: 1.5rem 1.25rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      transition: all 0.3s ease;
    }

    .path-card:hover {
      border-color: rgba(var(--accent-rgb), 0.25);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    }

    .path-card.is-current {
      border-color: rgba(var(--accent-rgb), 0.3);
      background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.04), transparent);
    }

    .pc-status {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: rgba(var(--accent-rgb), 0.12);
      color: var(--accent);
    }

    .pc-status::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
      animation: statusPulse 2s ease-in-out infinite;
    }

    @keyframes statusPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .pc-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
    }

    .pc-company {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .path-card.is-current .pc-company { color: var(--accent); }

    .pc-role {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .pc-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .pc-loc, .pc-period {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-tertiary);
    }

    .pc-loc svg, .pc-period svg {
      width: 12px;
      height: 12px;
      color: var(--accent);
      flex-shrink: 0;
    }

    .pc-years {
      font-weight: 600;
      color: var(--text-secondary);
    }

    /* ═══ TIMELINE ═══ */
    .tl-section { background: var(--bg-primary); }

    .tl-row {
      display: grid;
      grid-template-columns: 120px 40px 1fr;
      min-height: 60px;
    }

    .tl-date-col {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding-top: 1.75rem;
      padding-right: 0.75rem;
      gap: 0.125rem;
    }

    .tl-start {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
    }

    .tl-end {
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .tl-spine {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 1.75rem;
    }

    .spine-node {
      position: relative;
      width: 12px;
      height: 12px;
      border-radius: 3px;
      background: var(--bg-card);
      border: 2.5px solid var(--border-subtle);
      flex-shrink: 0;
      z-index: 1;
      transform: rotate(45deg);
    }

    .spine-node.active {
      border-color: var(--accent);
      background: var(--accent);
    }

    .node-ping {
      position: absolute;
      inset: -6px;
      border-radius: 3px;
      border: 2px solid var(--accent);
      animation: pingNode 2s ease-out infinite;
    }

    @keyframes pingNode {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .spine-wire {
      width: 2px;
      flex: 1;
      min-height: 30px;
      background: linear-gradient(to bottom, var(--border-subtle), transparent 90%);
    }

    .spine-node.active + .spine-wire {
      background: linear-gradient(to bottom, var(--accent), var(--border-subtle) 50%, transparent 90%);
    }

    /* ═══ EXPERIENCE CARD ═══ */
    .tl-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1.75rem;
      margin-left: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .tl-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--accent-gradient);
      transition: opacity 0.3s;
    }

    .tl-card:hover {
      border-color: rgba(var(--accent-rgb), 0.3);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
      transform: translateY(-3px);
    }

    .tl-card.is-current {
      border-color: rgba(var(--accent-rgb), 0.2);
      box-shadow: 0 4px 20px rgba(var(--accent-rgb), 0.06);
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.875rem;
      flex-wrap: wrap;
    }

    .card-role { font-size: 1.0625rem; font-weight: 700; line-height: 1.3; }

    .card-company {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--accent);
      margin-top: 0.125rem;
    }

    .card-loc {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .card-loc svg { width: 12px; height: 12px; color: var(--accent); }

    .card-desc {
      font-size: 0.9375rem;
      line-height: 1.65;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    /* Achievements */
    .card-ach {
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 10px;
    }

    .ach-label {
      display: block;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .ach-list {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .ach-list li {
      display: flex;
      gap: 0.5rem;
      font-size: 0.8125rem;
      line-height: 1.55;
      color: var(--text-secondary);
    }

    .ach-bullet {
      width: 5px;
      height: 5px;
      background: var(--accent);
      flex-shrink: 0;
      margin-top: 0.45rem;
      border-radius: 1px;
      transform: rotate(45deg);
    }

    /* Tech chips */
    .card-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      padding-top: 0.875rem;
      border-top: 1px solid var(--border-subtle);
    }

    .tech-chip {
      padding: 0.2rem 0.6rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.2s;
    }

    .tech-chip:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    /* ═══ CTA ═══ */
    .cta-section { background: var(--bg-secondary); }

    .cta-band {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 3rem;
      flex-wrap: wrap;
    }

    .cta-eyebrow {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .cta-heading {
      font-size: clamp(1.25rem, 2.5vw, 1.75rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.375rem;
    }

    .cta-sub { font-size: 0.9375rem; color: var(--text-secondary); }

    .cta-actions {
      display: flex;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.75rem;
      background: var(--accent);
      color: #fff;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
    }

    .cta-primary svg { width: 16px; height: 16px; transition: transform 0.3s; }

    .cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.3);
    }

    .cta-primary:hover svg { transform: translateX(4px); }

    .cta-ghost {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.75rem;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.2s;
    }

    .cta-ghost:hover { border-color: var(--accent); color: var(--accent); }

    /* ═══ ANIMATION ═══ */
    .anim-up {
      opacity: 0;
      transform: translateY(24px);
      animation: animUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) forwards;
    }

    @keyframes animUp {
      to { opacity: 1; transform: translateY(0); }
    }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 768px) {
      .exp-hero {
        min-height: auto;
        padding: 6rem 0 3rem;
      }

      .hero-title { font-size: clamp(2rem, 10vw, 3rem); }

      .career-path {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .tl-row {
        grid-template-columns: 1fr;
      }

      .tl-date-col {
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding: 0 0 0.25rem;
      }

      .tl-spine { display: none; }

      .tl-card {
        margin-left: 0;
        padding: 1.25rem;
      }

      .card-head { flex-direction: column; gap: 0.5rem; }

      .cta-band {
        flex-direction: column;
        text-align: center;
        padding: 2.5rem 1.5rem;
      }

      .cta-actions { flex-direction: column; width: 100%; }
      .cta-primary, .cta-ghost { justify-content: center; }
    }
  `],
})
export class ExperienceComponent implements OnInit {
  profileService = inject(ProfileService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    const profile = this.profileService.profile();
    if (profile) {
      this.seoService.update({
        title: `Experience — ${profile.firstName} ${profile.lastName}`,
        description: `Professional experience of ${profile.firstName} ${profile.lastName}`,
      });
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getYear(date: string): string {
    return new Date(date).getFullYear().toString();
  }

  getYearsOfExperience(): number {
    const experiences = this.profileService.experience();
    if (!experiences.length) return 0;
    const earliest = experiences.reduce((min, e) =>
      new Date(e.startDate) < new Date(min.startDate) ? e : min
    );
    return Math.floor(
      (Date.now() - new Date(earliest.startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
  }

  getDuration(startDate: string, endDate?: string | null): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem} mo`;
    if (rem === 0) return `${years} yr`;
    return `${years} yr ${rem} mo`;
  }
}
