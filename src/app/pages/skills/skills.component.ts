import { Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services';
import { Skill, SkillCategory } from '../../core/models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Immersive Hero -->
    <section class="skills-hero">
      <div class="hero-bg" aria-hidden="true">
        <div class="particle-field">
          @for (p of particles; track p.id) {
            <div class="particle" [style.--x]="p.x" [style.--y]="p.y" [style.--size]="p.size" [style.--delay]="p.delay" [style.--duration]="p.duration"></div>
          }
        </div>
        <div class="hex-grid">
          @for (h of hexCells; track h) {
            <div class="hex-cell" [style.--i]="h"></div>
          }
        </div>
        <div class="hero-glow"></div>
      </div>

      <div class="container hero-container">
        <div class="hero-content animate-fade-in-up">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Technical Arsenal</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line">Skills &</span>
            <span class="title-line title-accent">
              <span class="text-gradient-animated">Expertise</span>
              <svg class="title-underline" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0 8 Q50 0 100 6 Q150 12 200 4" stroke="url(#ug)" stroke-width="3" fill="none" stroke-linecap="round"/>
                <defs><linearGradient id="ug" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="var(--accent)"/><stop offset="100%" stop-color="var(--accent-hover, var(--accent))"/></linearGradient></defs>
              </svg>
            </span>
          </h1>
          <p class="hero-subtitle">
            {{ getYearsOfExperience() }}+ years building production systems — from pixel-perfect frontends to scalable cloud infrastructure.
          </p>
        </div>

        <!-- Animated Stat Orbs -->
        <div class="stat-orbs animate-fade-in-up stagger-2">
          <div class="orb">
            <svg class="orb-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-subtle)" stroke-width="3"/>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-dasharray="339.3" [attr.stroke-dashoffset]="339.3 - (339.3 * getSkillsByLevel(5).length / profileService.skills().length)" class="orb-progress"/>
            </svg>
            <div class="orb-inner">
              <span class="orb-value">{{ getSkillsByLevel(5).length }}</span>
              <span class="orb-label">Expert</span>
            </div>
          </div>
          <div class="orb">
            <svg class="orb-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-subtle)" stroke-width="3"/>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-dasharray="339.3" [attr.stroke-dashoffset]="339.3 - (339.3 * getSkillsByLevel(4).length / profileService.skills().length)" class="orb-progress"/>
            </svg>
            <div class="orb-inner">
              <span class="orb-value">{{ getSkillsByLevel(4).length }}</span>
              <span class="orb-label">Advanced</span>
            </div>
          </div>
          <div class="orb">
            <svg class="orb-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-subtle)" stroke-width="3"/>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-dasharray="339.3" [attr.stroke-dashoffset]="339.3 - (339.3 * getCategoryCount() / 10)" class="orb-progress"/>
            </svg>
            <div class="orb-inner">
              <span class="orb-value">{{ getCategoryCount() }}</span>
              <span class="orb-label">Domains</span>
            </div>
          </div>
          <div class="orb orb-total">
            <svg class="orb-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-subtle)" stroke-width="3"/>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-dasharray="339.3" stroke-dashoffset="0" class="orb-progress"/>
            </svg>
            <div class="orb-inner">
              <span class="orb-value">{{ profileService.skills().length }}</span>
              <span class="orb-label">Total</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Filter Bar -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <button class="filter-chip" [class.active]="activeCategory() === 'all'" (click)="activeCategory.set('all')">
            <span class="chip-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            </span>
            <span>All</span>
            <span class="chip-count">{{ profileService.skills().length }}</span>
          </button>
          @for (cat of categories(); track cat) {
            <button class="filter-chip" [class.active]="activeCategory() === cat" (click)="activeCategory.set(cat)">
              <span class="chip-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getCategoryIcon(cat)"></svg>
              </span>
              <span>{{ formatCategory(cat) }}</span>
              <span class="chip-count">{{ getCategoryCount(cat) }}</span>
            </button>
          }
        </div>
      </div>
    </section>

    <!-- Skills Mosaic -->
    <section class="section skills-mosaic">
      <div class="container">
        <!-- Category Sections -->
        @for (cat of displayCategories(); track cat) {
          <div class="category-block animate-fade-in-up">
            <div class="category-header">
              <div class="cat-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getCategoryIcon(cat)"></svg>
              </div>
              <div class="cat-meta">
                <h2 class="cat-title">{{ formatCategory(cat) }}</h2>
                <span class="cat-count">{{ getCategoryCount(cat) }} skills</span>
              </div>
              <div class="cat-line"></div>
            </div>

            <div class="skills-track">
              @for (skill of getSkillsForCategory(cat); track skill.name; let i = $index) {
                <div class="skill-tile" 
                     [class.is-expert]="skill.level === 5" 
                     [class.is-advanced]="skill.level === 4"
                     [style.--i]="i"
                     (mouseenter)="hoveredSkill.set(skill.name)"
                     (mouseleave)="hoveredSkill.set(null)">
                  
                  <!-- Glow backdrop -->
                  <div class="tile-glow" aria-hidden="true"></div>

                  <div class="tile-body">
                    <div class="tile-top">
                      <h3 class="tile-name">{{ skill.name }}</h3>
                      <span class="level-badge" 
                            [class.level-5]="skill.level === 5" 
                            [class.level-4]="skill.level === 4" 
                            [class.level-3]="skill.level === 3"
                            [class.level-2]="skill.level === 2"
                            [class.level-1]="skill.level === 1">
                        <span class="level-badge-dot"></span>
                        {{ getLevelLabel(skill.level) }}
                      </span>
                    </div>

                    <!-- Animated progress bar -->
                    <div class="tile-progress">
                      <div class="progress-track">
                        <div class="progress-fill" [style.--pct]="(skill.level / 5 * 100) + '%'"></div>
                      </div>
                    </div>

                    <!-- Tags -->
                    @if (skill.tags && skill.tags.length > 0) {
                      <div class="tile-tags">
                        @for (tag of skill.tags; track tag) {
                          <span class="tile-tag">{{ tag }}</span>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Proficiency Overview -->
    <section class="section prof-section">
      <div class="container">
        <div class="prof-grid">
          <div class="prof-chart animate-fade-in-up">
            <h3 class="prof-title">Proficiency Distribution</h3>
            <div class="bar-chart">
              @for (item of proficiencyData(); track item.label) {
                <div class="bar-row">
                  <span class="bar-label">{{ item.label }}</span>
                  <div class="bar-track">
                    <div class="bar-fill" [style.--w]="item.pct + '%'" [style.--color]="item.color"></div>
                  </div>
                  <span class="bar-value">{{ item.count }}</span>
                </div>
              }
            </div>
          </div>
          <div class="prof-radar animate-fade-in-up stagger-2">
            <h3 class="prof-title">Category Breakdown</h3>
            <div class="radar-list">
              @for (cat of categories(); track cat; let i = $index) {
                <div class="radar-item" [style.--delay]="(i * 0.08) + 's'">
                  <div class="radar-icon-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getCategoryIcon(cat)"></svg>
                  </div>
                  <span class="radar-cat-name">{{ formatCategory(cat) }}</span>
                  <div class="radar-bar">
                    <div class="radar-bar-fill" [style.--w]="(getCategoryCount(cat) / profileService.skills().length * 100) + '%'"></div>
                  </div>
                  <span class="radar-cat-count">{{ getCategoryCount(cat) }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-card animate-fade-in-up">
          <div class="cta-glow" aria-hidden="true"></div>
          <div class="cta-content">
            <div class="cta-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              </svg>
            </div>
            <h2 class="cta-title">See these skills in action</h2>
            <p class="cta-text">Explore real-world projects where I've applied this tech stack to solve complex problems.</p>
            <a routerLink="/projects" class="cta-btn">
              View Projects
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ═══════════════ HERO ═══════════════ */
    .skills-hero {
      position: relative;
      padding: 7rem 0 5rem;
      overflow: hidden;
      min-height: 520px;
      display: flex;
      align-items: center;
    }

    .hero-container {
      position: relative;
      z-index: 2;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .hero-glow {
      position: absolute;
      top: -30%;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 700px;
      background: radial-gradient(ellipse, rgba(var(--accent-rgb), 0.12) 0%, transparent 65%);
      animation: pulseGlow 6s ease-in-out infinite;
    }

    @keyframes pulseGlow {
      0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
      50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
    }

    /* Particle field */
    .particle-field {
      position: absolute;
      inset: 0;
    }

    .particle {
      position: absolute;
      left: calc(var(--x) * 1%);
      top: calc(var(--y) * 1%);
      width: calc(var(--size) * 1px);
      height: calc(var(--size) * 1px);
      background: var(--accent);
      border-radius: 50%;
      opacity: 0;
      animation: particleFloat var(--duration) var(--delay) ease-in-out infinite;
    }

    @keyframes particleFloat {
      0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
      30% { opacity: 0.4; }
      50% { opacity: 0.6; transform: translateY(-30px) scale(1); }
      70% { opacity: 0.3; }
    }

    /* Hex grid bg */
    .hex-grid {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 4px;
      padding: 2rem;
      opacity: 0.04;
    }

    .hex-cell {
      aspect-ratio: 1;
      background: var(--accent);
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      animation: hexPulse 4s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.1s);
    }

    @keyframes hexPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    /* Hero content */
    .hero-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 3rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      background: rgba(var(--accent-rgb), 0.08);
      border: 1px solid rgba(var(--accent-rgb), 0.2);
      border-radius: 100px;
      margin-bottom: 2rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      animation: dotBlink 2s ease-in-out infinite;
    }

    @keyframes dotBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .hero-title {
      font-size: clamp(2.75rem, 6vw, 4.5rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
    }

    .title-line {
      display: block;
    }

    .title-accent {
      position: relative;
      display: inline-block;
    }

    .title-underline {
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 12px;
      opacity: 0.6;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      line-height: 1.8;
      color: var(--text-secondary);
      max-width: 560px;
      margin: 0 auto;
    }

    /* Stat Orbs */
    .stat-orbs {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .orb {
      position: relative;
      width: 110px;
      height: 110px;
    }

    .orb-ring {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      filter: drop-shadow(0 0 8px rgba(var(--accent-rgb), 0.2));
    }

    .orb-progress {
      transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .orb-inner {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .orb-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
    }

    .orb-label {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-tertiary);
      margin-top: 0.25rem;
    }

    /* ═══════════════ FILTER BAR ═══════════════ */
    .filter-section {
      position: sticky;
      top: 64px;
      z-index: 20;
      padding: 1rem 0;
      background: rgba(var(--bg-primary-rgb, 255,255,255), 0.85);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border-bottom: 1px solid var(--border-subtle);
    }

    .filter-bar {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 0.25rem;
    }

    .filter-bar::-webkit-scrollbar { display: none; }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 100px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .filter-chip:hover {
      border-color: var(--accent);
      color: var(--text-primary);
      transform: translateY(-1px);
    }

    .filter-chip.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
      box-shadow: 0 4px 20px rgba(var(--accent-rgb), 0.35);
    }

    .chip-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chip-icon svg {
      width: 16px;
      height: 16px;
    }

    .chip-count {
      padding: 0.125rem 0.5rem;
      font-size: 0.6875rem;
      font-weight: 700;
      border-radius: 100px;
      background: rgba(255,255,255,0.15);
      line-height: 1.3;
    }

    .filter-chip:not(.active) .chip-count {
      background: var(--bg-tertiary);
    }

    /* ═══════════════ SKILLS MOSAIC ═══════════════ */
    .skills-mosaic {
      background: var(--bg-secondary);
    }

    .category-block {
      margin-bottom: 3.5rem;
    }

    .category-block:last-child {
      margin-bottom: 0;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }

    .cat-icon-wrap {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-subtle);
      border-radius: 12px;
      color: var(--accent);
      flex-shrink: 0;
    }

    .cat-icon-wrap svg {
      width: 22px;
      height: 22px;
    }

    .cat-meta {
      flex-shrink: 0;
    }

    .cat-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
    }

    .cat-count {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .cat-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, var(--border-subtle), transparent);
    }

    /* Skill tiles */
    .skills-track {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .skill-tile {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: tileEnter 0.5s ease both;
      animation-delay: calc(var(--i) * 0.04s);
    }

    @keyframes tileEnter {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .skill-tile:hover {
      border-color: rgba(var(--accent-rgb), 0.5);
      transform: translateY(-6px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(var(--accent-rgb), 0.1);
    }

    .skill-tile.is-expert {
      border-color: rgba(251, 191, 36, 0.25);
    }

    .skill-tile.is-expert:hover {
      border-color: rgba(251, 191, 36, 0.6);
      box-shadow: 0 20px 50px rgba(251, 191, 36, 0.1), 0 0 30px rgba(251, 191, 36, 0.05);
    }

    .skill-tile.is-advanced {
      border-color: rgba(var(--accent-rgb), 0.2);
    }

    .skill-tile.is-advanced:hover {
      border-color: rgba(var(--accent-rgb), 0.6);
    }

    /* Glow effect */
    .tile-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(var(--accent-rgb), 0.06) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }

    .skill-tile:hover .tile-glow {
      opacity: 1;
    }

    .skill-tile.is-expert .tile-glow {
      background: radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.06) 0%, transparent 60%);
    }

    /* Tile body */
    .tile-body {
      padding: 1.25rem;
      position: relative;
      z-index: 1;
    }

    .tile-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .tile-name {
      font-size: 1rem;
      font-weight: 650;
      margin: 0;
      color: var(--text-primary);
    }

    /* Level badge */
    .level-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 0.1875rem 0.625rem;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-radius: 100px;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .level-badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
      animation: badgePulse 2s ease-in-out infinite;
    }

    @keyframes badgePulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.7; }
    }

    .level-badge.level-5 {
      background: rgba(251, 191, 36, 0.12);
      color: #f59e0b;
      border: 1px solid rgba(251, 191, 36, 0.25);
    }
    .level-badge.level-5 .level-badge-dot { background: #fbbf24; box-shadow: 0 0 6px rgba(251, 191, 36, 0.6); }

    .level-badge.level-4 {
      background: rgba(var(--accent-rgb), 0.1);
      color: var(--accent);
      border: 1px solid rgba(var(--accent-rgb), 0.2);
    }
    .level-badge.level-4 .level-badge-dot { background: var(--accent); box-shadow: 0 0 6px rgba(var(--accent-rgb), 0.5); }

    .level-badge.level-3 {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .level-badge.level-3 .level-badge-dot { background: #10b981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.5); }

    .level-badge.level-2 {
      background: rgba(14, 165, 233, 0.1);
      color: #0ea5e9;
      border: 1px solid rgba(14, 165, 233, 0.2);
    }
    .level-badge.level-2 .level-badge-dot { background: #0ea5e9; box-shadow: 0 0 6px rgba(14, 165, 233, 0.5); }

    .level-badge.level-1 {
      background: rgba(var(--accent-rgb), 0.06);
      color: var(--text-tertiary);
      border: 1px solid var(--border-subtle);
    }
    .level-badge.level-1 .level-badge-dot { background: var(--text-tertiary); }

    .skill-tile:hover .level-badge {
      transform: translateY(-1px);
      box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    }

    /* Progress bar */
    .tile-progress {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .progress-track {
      flex: 1;
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: var(--pct);
      background: var(--accent-gradient);
      border-radius: 4px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      right: 0;
      top: -2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.4);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .skill-tile:hover .progress-fill::after {
      opacity: 1;
    }

    .skill-tile.is-expert .progress-fill {
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
    }



    /* Tags */
    .tile-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .tile-tag {
      padding: 0.2rem 0.625rem;
      font-size: 0.6875rem;
      font-weight: 500;
      background: var(--accent-subtle);
      color: var(--accent);
      border-radius: 100px;
      transition: all 0.25s ease;
    }

    .tile-tag:hover {
      background: var(--accent);
      color: #fff;
      transform: translateY(-1px);
    }

    .skill-tile.is-expert .tile-tag {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
    }

    .skill-tile.is-expert .tile-tag:hover {
      background: #fbbf24;
      color: #000;
    }

    /* ═══════════════ PROFICIENCY SECTION ═══════════════ */
    .prof-section {
      background: var(--bg-primary);
    }

    .prof-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .prof-chart, .prof-radar {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 2rem;
    }

    .prof-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0 0 1.75rem;
    }

    /* Bar chart */
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .bar-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .bar-label {
      width: 90px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-align: right;
      flex-shrink: 0;
    }

    .bar-track {
      flex: 1;
      height: 10px;
      background: var(--bg-tertiary);
      border-radius: 10px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      width: var(--w);
      background: var(--color);
      border-radius: 10px;
      transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bar-value {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--text-primary);
      width: 28px;
      text-align: right;
    }

    /* Radar / category list */
    .radar-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .radar-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideInRight 0.5s ease both;
      animation-delay: var(--delay);
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(-12px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .radar-icon-sm {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-subtle);
      border-radius: 8px;
      color: var(--accent);
      flex-shrink: 0;
    }

    .radar-icon-sm svg {
      width: 16px;
      height: 16px;
    }

    .radar-cat-name {
      font-size: 0.8125rem;
      font-weight: 600;
      width: 80px;
      flex-shrink: 0;
    }

    .radar-bar {
      flex: 1;
      height: 6px;
      background: var(--bg-tertiary);
      border-radius: 6px;
      overflow: hidden;
    }

    .radar-bar-fill {
      height: 100%;
      width: var(--w);
      background: var(--accent-gradient);
      border-radius: 6px;
      transition: width 1s ease;
    }

    .radar-cat-count {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-primary);
      width: 20px;
      text-align: right;
    }

    /* ═══════════════ CTA ═══════════════ */
    .cta-section {
      background: var(--bg-secondary);
    }

    .cta-card {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      max-width: 640px;
      margin: 0 auto;
    }

    .cta-glow {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 300px;
      background: radial-gradient(ellipse, rgba(var(--accent-rgb), 0.1) 0%, transparent 70%);
    }

    .cta-content {
      position: relative;
      text-align: center;
      padding: 4rem 2rem;
    }

    .cta-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
      color: var(--accent);
      background: var(--accent-subtle);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .cta-icon:hover {
      transform: rotate(-10deg) scale(1.1);
    }

    .cta-icon svg {
      width: 32px;
      height: 32px;
    }

    .cta-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .cta-text {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 2rem;
      background: var(--accent-gradient);
      color: #fff;
      font-weight: 600;
      font-size: 0.9375rem;
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(var(--accent-rgb), 0.35);
    }

    /* ═══════════════ RESPONSIVE ═══════════════ */
    @media (max-width: 768px) {
      .skills-hero {
        padding: 5rem 0 3rem;
        min-height: auto;
      }

      .stat-orbs {
        gap: 1rem;
      }

      .orb {
        width: 85px;
        height: 85px;
      }

      .orb-value {
        font-size: 1.25rem;
      }

      /* ── Compact skill chips on mobile ── */
      .skills-track {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 0.5rem;
      }

      .skill-tile {
        border-radius: 10px;
      }

      .tile-glow {
        display: none;
      }

      .tile-body {
        padding: 0.625rem 0.75rem;
      }

      .tile-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.375rem;
        margin-bottom: 0;
      }

      .tile-name {
        font-size: 0.8125rem;
        line-height: 1.2;
      }

      .level-badge {
        padding: 0.125rem 0.5rem;
        font-size: 0.5625rem;
        gap: 4px;
      }

      .level-badge-dot {
        width: 5px;
        height: 5px;
      }

      .tile-progress {
        display: none;
      }

      .tile-tags {
        display: none;
      }

      /* Category blocks compact */
      .category-block {
        margin-bottom: 2rem;
      }

      .category-header {
        margin-bottom: 1rem;
      }

      .cat-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }

      .cat-icon-wrap svg {
        width: 16px;
        height: 16px;
      }

      .cat-title {
        font-size: 1rem;
      }

      /* Hide proficiency section on mobile */
      .prof-section {
        display: none;
      }

      .prof-grid {
        grid-template-columns: 1fr;
      }

      .filter-bar {
        padding-bottom: 0.5rem;
      }

      .hex-grid {
        display: none;
      }

      /* CTA compact */
      .cta-content {
        padding: 2.5rem 1.5rem;
      }

      .cta-title {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .stat-orbs {
        gap: 0.5rem;
      }

      .orb {
        width: 72px;
        height: 72px;
      }

      .orb-value {
        font-size: 1.1rem;
      }

      .orb-label {
        font-size: 0.5625rem;
      }

      .skills-track {
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 0.375rem;
      }

      .tile-body {
        padding: 0.4375rem 0.625rem;
      }

      .tile-name {
        font-size: 0.75rem;
      }
    }
  `],
})
export class SkillsComponent implements OnInit {
  profileService = inject(ProfileService);

  activeCategory = signal<SkillCategory | 'all'>('all');
  hoveredSkill = signal<string | null>(null);
  levelDots = [1, 2, 3, 4, 5];

  particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 + '',
    y: Math.random() * 100 + '',
    size: (Math.random() * 4 + 2) + '',
    delay: (Math.random() * 3) + 's',
    duration: (Math.random() * 4 + 4) + 's',
  }));

  hexCells = Array.from({ length: 60 }, (_, i) => i);

  categories = computed(() => {
    const cats = new Set(this.profileService.skills().map(s => s.category));
    return Array.from(cats);
  });

  displayCategories = computed(() => {
    const active = this.activeCategory();
    if (active === 'all') return this.categories();
    return [active];
  });

  proficiencyData = computed(() => {
    const skills = this.profileService.skills();
    const total = skills.length || 1;
    return [
      { label: 'Expert (5)', count: skills.filter(s => s.level === 5).length, pct: (skills.filter(s => s.level === 5).length / total * 100), color: '#fbbf24' },
      { label: 'Advanced (4)', count: skills.filter(s => s.level === 4).length, pct: (skills.filter(s => s.level === 4).length / total * 100), color: 'var(--accent)' },
      { label: 'Intermediate (3)', count: skills.filter(s => s.level === 3).length, pct: (skills.filter(s => s.level === 3).length / total * 100), color: '#10b981' },
    ];
  });

  ngOnInit() {}

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

  getSkillsByLevel(level: number): Skill[] {
    return this.profileService.skills().filter(s => s.level === level);
  }

  getCategoryCount(cat?: string): number {
    if (cat) return this.profileService.skills().filter(s => s.category === cat).length;
    return new Set(this.profileService.skills().map(s => s.category)).size;
  }

  getSkillsForCategory(cat: string): Skill[] {
    return this.profileService.skills().filter(s => s.category === cat);
  }

  formatCategory(cat: string): string {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  getLevelLabel(level: number): string {
    const labels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level] || '';
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      frontend: '<path d="M17 8l4 4m0 0l-4 4m4-4H3"/><path d="M3 4h18v16H3z" stroke-dasharray="4 2"/>',
      backend: '<path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>',
      database: '<path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>',
      cloud: '<path d="M8 19.5c-2.5 0-4.5-2-4.5-4.5 0-2.03 1.34-3.75 3.18-4.32A5.5 5.5 0 0117.5 10c.17 0 .34.01.5.03A4.5 4.5 0 0121.5 14.5c0 2.49-2.01 4.5-4.5 4.5H8z"/>',
      devops: '<path d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-9-9V1.5m0 21V21"/>',
      testing: '<path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
      tools: '<path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"/>',
    };
    return icons[cat] || icons['tools'];
  }
}
