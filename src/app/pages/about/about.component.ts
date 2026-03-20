import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService, SeoService } from '../../core/services';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (profileService.profile(); as profile) {
      <!-- HERO — Editorial / Magazine Layout (NO circles, NO split grid) -->
      <section class="about-hero">
        <!-- Animated floating shapes bg -->
        <div class="hero-bands" aria-hidden="true"></div>
        <div class="hero-shapes" aria-hidden="true">
          <div class="shape shape-bracket">&lt;/&gt;</div>
          <div class="shape shape-at">&#64;</div>
          <div class="shape shape-hash">#</div>
          <div class="shape shape-curly">&#123;&#125;</div>
          <div class="shape shape-semicol">;</div>
          <div class="shape shape-arrow">=&gt;</div>
        </div>
        <!-- Vertical rotated side label -->
        <div class="hero-side-label" aria-hidden="true">ABOUT</div>

        <div class="container hero-center">
          <span class="hero-eyebrow anim-rise" style="--d:0.05s">
            <span class="eyebrow-line"></span>
            About Me
          </span>
          <h1 class="hero-name anim-rise" style="--d:0.15s">
            {{ profile.firstName }}
            <span class="name-underlined">{{ profile.lastName }}
              <svg class="name-svg-line" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0 9 Q40 2 80 7 Q120 12 160 5 Q180 2 200 6" stroke="var(--accent)" stroke-width="3" fill="none" stroke-linecap="round">
                  <animate attributeName="stroke-dashoffset" from="320" to="0" dur="1s" begin="0.6s" fill="freeze"/>
                </path>
              </svg>
            </span>
          </h1>
          <p class="hero-headline anim-rise" style="--d:0.25s">{{ profile.headline }}</p>

          <!-- Horizontal quick-info strip (NOT a card) -->
          <div class="info-strip anim-rise" style="--d:0.35s">
            <div class="strip-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ profile.location }}
            </div>
            <span class="strip-sep"></span>
            <a [href]="'mailto:' + profile.email" class="strip-item strip-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {{ profile.email }}
            </a>
            <span class="strip-sep"></span>
            <div class="strip-item">
              <span class="avail-dot" [class]="profile.availability"></span>
              {{ profile.availability === 'available' ? 'Open to Opportunities' : 'Currently Engaged' }}
            </div>
          </div>
        </div>
      </section>

      <!-- Summary — Full-width pullquote -->
      <section class="quote-section section">
        <div class="container">
          <blockquote class="pullquote anim-rise" style="--d:0.1s">
            <p>{{ profile.summary }}</p>
          </blockquote>
        </div>
      </section>

      <!-- Contact Row -->
      <section class="contact-row-section section">
        <div class="container">
          <div class="contact-row">
            <a [href]="'mailto:' + profile.email" class="cr-item anim-rise" style="--d:0.05s">
              <div class="cr-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div class="cr-text">
                <span class="cr-label">Email</span>
                <span class="cr-value">{{ profile.email }}</span>
              </div>
              <svg class="cr-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
            </a>
            @if (profile.phone) {
              <div class="cr-item anim-rise" style="--d:0.1s">
                <div class="cr-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="cr-text">
                  <span class="cr-label">Phone</span>
                  <span class="cr-value">{{ profile.phone }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Education -->
      @if (profileService.education().length > 0) {
        <section class="edu-section section">
          <div class="container">
            <div class="sec-header anim-rise" style="--d:0.05s">
              <span class="sec-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"/></svg>
                Education
              </span>
              <h2 class="sec-title">Academic Background</h2>
            </div>
            <div class="edu-cards">
              @for (edu of profileService.education(); track edu.institution; let i = $index) {
                <div class="edu-card anim-rise" [style.--d]="(i * 0.08 + 0.1) + 's'">
                  <div class="edu-accent-bar"></div>
                  <div class="edu-header">
                    <h3 class="edu-degree">{{ edu.degree }}</h3>
                    <span class="edu-period">{{ edu.startDate }} — {{ edu.endDate }}</span>
                  </div>
                  <p class="edu-school">{{ edu.institution }}</p>
                  <p class="edu-field-text">{{ edu.field }}</p>
                  @if (edu.grade) {
                    <div class="edu-grade-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {{ edu.grade }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- Certifications -->
      @if (profileService.certifications().length > 0) {
        <section class="cert-section section">
          <div class="container">
            <div class="sec-header anim-rise" style="--d:0.05s">
              <span class="sec-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/><circle cx="12" cy="8" r="7"/></svg>
                Credentials
              </span>
              <h2 class="sec-title">Certifications</h2>
            </div>
            <div class="cert-grid">
              @for (cert of profileService.certifications(); track cert.name; let i = $index) {
                <div class="cert-card anim-rise" [style.--d]="(i * 0.08 + 0.1) + 's'">
                  <div class="cert-stripe"></div>
                  <div class="cert-body">
                    <div class="cert-seal">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <h4 class="cert-name">{{ cert.name }}</h4>
                    <p class="cert-issuer">{{ cert.issuer }}</p>
                    <span class="cert-date">{{ cert.date }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- CTA -->
      <section class="cta-section section">
        <div class="container">
          <div class="cta-box anim-rise" style="--d:0.05s">
            <div class="cta-inner">
              <span class="cta-label">Let's Connect</span>
              <h2 class="cta-heading">Interested in working together?</h2>
              <p class="cta-desc">Always open to discussing new projects and opportunities.</p>
              <a routerLink="/p/dinil/contact" class="cta-btn">
                <span>Get in Touch</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    /* ═══════════════════════════════════
       ABOUT HERO — EDITORIAL / MAGAZINE
       Single column, centered, NO circles,
       NO split grid, NO particle fields
       ═══════════════════════════════════ */
    .about-hero {
      position: relative;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 8rem 0 4rem;
      text-align: center;
    }

    /* Layered gradient background */
    .hero-bands {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(135deg, rgba(var(--accent-rgb), 0.06) 0%, transparent 40%),
        linear-gradient(-45deg, rgba(var(--accent-rgb), 0.04) 0%, transparent 35%),
        radial-gradient(ellipse at 80% 20%, rgba(var(--accent-rgb), 0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 20% 80%, rgba(var(--accent-rgb), 0.03) 0%, transparent 40%);
      pointer-events: none;
    }

    /* Floating code symbols */
    .hero-shapes {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
      font-weight: 700;
      color: var(--accent);
      opacity: 0;
      animation: shapeFloat 12s ease-in-out infinite;
    }

    .shape-bracket { top: 15%; left: 8%; font-size: 2.5rem; animation-delay: 0s; }
    .shape-at      { top: 25%; right: 12%; font-size: 2rem; animation-delay: 2s; }
    .shape-hash    { bottom: 30%; left: 15%; font-size: 1.75rem; animation-delay: 4s; }
    .shape-curly   { top: 60%; right: 8%; font-size: 2.25rem; animation-delay: 6s; }
    .shape-semicol { top: 40%; left: 5%; font-size: 3rem; animation-delay: 8s; }
    .shape-arrow   { bottom: 20%; right: 18%; font-size: 1.5rem; animation-delay: 10s; }

    @keyframes shapeFloat {
      0%, 100% { opacity: 0; transform: translateY(20px) rotate(0deg); }
      15% { opacity: 0.08; }
      50% { opacity: 0.12; transform: translateY(-15px) rotate(8deg); }
      85% { opacity: 0.06; }
    }

    /* Vertical rotated side label */
    .hero-side-label {
      position: absolute;
      left: 2rem;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      font-size: clamp(5rem, 12vw, 9rem);
      font-weight: 900;
      letter-spacing: 0.15em;
      color: transparent;
      -webkit-text-stroke: 1px rgba(var(--accent-rgb), 0.06);
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
    }

    .hero-center {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Eyebrow label */
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--accent);
      margin-bottom: 1.5rem;
    }

    .eyebrow-line {
      display: inline-block;
      width: 2.5rem;
      height: 2px;
      background: var(--accent);
    }

    /* Name — Large editorial typography with underline accent */
    .hero-name {
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.04em;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .name-underlined {
      position: relative;
      display: inline-block;
    }

    .name-svg-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 12px;
      opacity: 0.55;
    }

    .name-svg-line path {
      stroke-dasharray: 320;
      stroke-dashoffset: 320;
    }

    .hero-headline {
      font-size: clamp(0.875rem, 1.5vw, 1.125rem);
      color: var(--text-secondary);
      line-height: 1.5;
      max-width: 600px;
      margin-bottom: 2rem;
      font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
    }

    /* Horizontal info strip — flat inline, NOT a card */
    .info-strip {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
      padding: 1rem 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
    }

    .strip-item {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .strip-item svg {
      width: 14px;
      height: 14px;
      color: var(--accent);
      flex-shrink: 0;
    }

    .strip-link {
      text-decoration: none;
      color: var(--text-secondary);
      transition: color 0.2s;
    }

    .strip-link:hover { color: var(--accent); }

    .strip-sep {
      width: 1px;
      height: 16px;
      background: var(--border-subtle);
    }

    .avail-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
      animation: pulseDot 2s ease-in-out infinite;
    }

    .avail-dot.available { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.5); }
    .avail-dot.busy { background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.5); }

    @keyframes pulseDot {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.4); opacity: 0.6; }
    }

    /* ═══ PULLQUOTE ═══ */
    .quote-section {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .pullquote {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      padding-left: 2rem;
      border-left: 4px solid var(--accent);
    }

    .pullquote p {
      font-size: 1.125rem;
      line-height: 1.85;
      color: var(--text-secondary);
      font-style: italic;
    }

    /* ═══ CONTACT ROW ═══ */
    .contact-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .cr-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
    }

    .cr-item:hover {
      border-color: rgba(var(--accent-rgb), 0.3);
      transform: translateY(-3px);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
    }

    .cr-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--accent-rgb), 0.08);
      border-radius: 10px;
      flex-shrink: 0;
    }

    .cr-icon svg { width: 20px; height: 20px; color: var(--accent); }

    .cr-label {
      display: block;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-tertiary);
      margin-bottom: 0.125rem;
    }

    .cr-value { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }

    .cr-arrow {
      width: 16px;
      height: 16px;
      color: var(--text-tertiary);
      margin-left: auto;
      transition: all 0.3s;
    }

    .cr-item:hover .cr-arrow { transform: translate(3px, -3px); color: var(--accent); }

    /* ═══ SECTION COMMON ═══ */
    .sec-header { margin-bottom: 2.5rem; }

    .sec-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.875rem;
      background: rgba(var(--accent-rgb), 0.08);
      border: 1px solid rgba(var(--accent-rgb), 0.15);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 0.875rem;
    }

    .sec-chip svg { width: 14px; height: 14px; }

    .sec-title {
      font-size: clamp(1.5rem, 3.5vw, 2.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    /* ═══ EDUCATION ═══ */
    .edu-section { background: var(--bg-primary); }

    .edu-cards { display: flex; flex-direction: column; gap: 1.25rem; }

    .edu-card {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.5rem 1.5rem 1.5rem 2rem;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .edu-card:hover {
      border-color: rgba(var(--accent-rgb), 0.25);
      transform: translateX(6px);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
    }

    .edu-accent-bar {
      position: absolute; top: 0; left: 0; width: 4px; height: 100%;
      background: var(--accent-gradient); border-radius: 4px 0 0 4px;
    }

    .edu-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;
    }

    .edu-degree { font-size: 1.0625rem; font-weight: 700; }

    .edu-period {
      padding: 0.25rem 0.75rem; background: rgba(var(--accent-rgb), 0.1);
      border-radius: 100px; font-size: 0.6875rem; font-weight: 600;
      color: var(--accent); white-space: nowrap;
    }

    .edu-school { font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; }
    .edu-field-text { font-size: 0.8125rem; color: var(--text-tertiary); margin-top: 0.125rem; }

    .edu-grade-badge {
      display: inline-flex; align-items: center; gap: 0.375rem;
      margin-top: 0.75rem; padding: 0.25rem 0.75rem;
      background: rgba(245, 158, 11, 0.1); border-radius: 100px;
      font-size: 0.75rem; font-weight: 600; color: #f59e0b;
    }

    .edu-grade-badge svg { width: 12px; height: 12px; }

    /* ═══ CERTIFICATIONS ═══ */
    .cert-section { background: var(--bg-secondary); }

    .cert-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
      gap: 1.25rem;
    }

    .cert-card {
      position: relative; background: var(--bg-card); border: 1px solid var(--border-subtle);
      border-radius: 16px; overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cert-card:hover {
      transform: translateY(-6px); border-color: rgba(var(--accent-rgb), 0.25);
      box-shadow: 0 18px 44px rgba(0, 0, 0, 0.08);
    }

    .cert-stripe { height: 4px; background: var(--accent-gradient); }
    .cert-body { padding: 1.5rem; }

    .cert-seal {
      width: 36px; height: 36px; display: flex; align-items: center;
      justify-content: center; background: rgba(var(--accent-rgb), 0.1);
      border-radius: 10px; color: var(--accent); margin-bottom: 1rem;
    }

    .cert-seal svg { width: 18px; height: 18px; }
    .cert-name { font-size: 1rem; font-weight: 700; margin-bottom: 0.375rem; }
    .cert-issuer { font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
    .cert-date {
      font-size: 0.6875rem; font-weight: 600; color: var(--text-tertiary);
      text-transform: uppercase; letter-spacing: 0.03em;
    }

    /* ═══ CTA ═══ */
    .cta-section { background: var(--bg-primary); }

    .cta-box {
      position: relative; background: var(--bg-card); border: 1px solid var(--border-subtle);
      border-radius: 24px; overflow: hidden;
    }

    .cta-inner { position: relative; padding: 4rem; text-align: center; }

    .cta-label {
      display: inline-block; font-size: 0.8125rem; font-weight: 600;
      color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }

    .cta-heading {
      font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700;
      letter-spacing: -0.02em; margin-bottom: 0.75rem;
    }

    .cta-desc { font-size: 1rem; color: var(--text-secondary); margin-bottom: 2rem; }

    .cta-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.875rem 2rem; background: var(--accent); color: #fff;
      border: none; border-radius: 12px; font-size: 0.9375rem; font-weight: 600;
      text-decoration: none; transition: all 0.3s ease;
    }

    .cta-btn svg { width: 18px; height: 18px; transition: transform 0.3s; }

    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.3);
    }

    .cta-btn:hover svg { transform: translateX(4px); }

    /* ═══ ANIMATION ═══ */
    .anim-rise {
      opacity: 0;
      transform: translateY(28px);
      animation: animRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) forwards;
    }

    @keyframes animRise {
      to { opacity: 1; transform: translateY(0); }
    }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 768px) {
      .about-hero { min-height: auto; padding: 6rem 0 3rem; }
      .hero-side-label { display: none; }
      .hero-name { font-size: clamp(2.5rem, 12vw, 3.5rem); }
      .info-strip { flex-direction: column; gap: 0.5rem; padding: 1rem; }
      .strip-sep { width: 50%; height: 1px; }
      .contact-row { grid-template-columns: 1fr; }
      .cta-inner { padding: 2.5rem 1.5rem; }
    }
  `],
})
export class AboutComponent implements OnInit {
  profileService = inject(ProfileService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    const profile = this.profileService.profile();
    if (profile) {
      this.seoService.update({
        title: `About ${profile.firstName} ${profile.lastName}`,
        description: profile.summary,
      });
    }
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
}
