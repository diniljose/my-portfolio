import { Component, Input, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill, SkillCategory } from '../../../core/models';

@Component({
  selector: 'app-skill-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Category Filter Pills -->
    <div class="skill-filters">
      <button
        class="filter-pill"
        [class.active]="activeCategory() === 'all'"
        (click)="activeCategory.set('all')">
        <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
        </svg>
        <span>All Skills</span>
        <span class="filter-count">{{ skills.length }}</span>
      </button>
      @for (cat of categories(); track cat) {
        <button
          class="filter-pill"
          [class.active]="activeCategory() === cat"
          (click)="activeCategory.set(cat)">
          <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getCategoryIcon(cat)"></svg>
          <span>{{ formatCategory(cat) }}</span>
          <span class="filter-count">{{ getCategoryCount(cat) }}</span>
        </button>
      }
    </div>

    <!-- Skills Grid with 3D Cards -->
    <div class="skill-grid">
      @for (skill of filteredSkills(); track skill.name; let i = $index) {
        <div class="skill-card-wrapper animate-fade-in-up" [style.animation-delay]="(i * 0.05) + 's'">
          <div class="skill-card" 
               [class.expert]="skill.level === 5"
               [class.advanced]="skill.level === 4"
               (mouseenter)="hoveredSkill.set(skill.name)"
               (mouseleave)="hoveredSkill.set(null)">
            
            <!-- Skill Header -->
            <div class="skill-header">
              <div class="skill-icon-container">
                <svg class="skill-category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getCategoryIcon(skill.category)"></svg>
              </div>
              <div class="skill-info">
                <h4 class="skill-name">{{ skill.name }}</h4>
                <span class="skill-category-label">{{ formatCategory(skill.category) }}</span>
              </div>
              @if (skill.level === 5) {
                <div class="expertise-badge">
                  <svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="badge-text">Expert</span>
                </div>
              }
            </div>

            <!-- Animated Progress Ring -->
            <div class="skill-progress">
              <svg class="progress-ring" viewBox="0 0 100 100">
                <circle class="progress-bg" cx="50" cy="50" r="42"/>
                <circle class="progress-fill" cx="50" cy="50" r="42"
                  [style.stroke-dasharray]="'264'"
                  [style.stroke-dashoffset]="264 - (264 * skill.level / 5)"/>
              </svg>
              <div class="progress-center">
                <span class="progress-value">{{ skill.level * 20 }}</span>
                <span class="progress-percent">%</span>
              </div>
            </div>

            <!-- Level Bar (alternative view) -->
            <div class="skill-level-bar">
              <div class="level-track">
                @for (dot of [1,2,3,4,5]; track dot) {
                  <div class="level-dot" [class.filled]="dot <= skill.level" [class.pulse]="dot === skill.level"></div>
                }
              </div>
              <span class="level-label">{{ getLevelLabel(skill.level) }}</span>
            </div>

            <!-- Tags with animations -->
            @if (skill.tags && skill.tags.length > 0) {
              <div class="skill-tags">
                @for (tag of skill.tags; track tag; let j = $index) {
                  <span class="skill-tag" [style.animation-delay]="(j * 0.05) + 's'">
                    {{ tag }}
                  </span>
                }
              </div>
            }

            <!-- Hover Glow Effect -->
            <div class="card-glow" aria-hidden="true"></div>
          </div>
        </div>
      }
    </div>

    <!-- Empty State -->
    @if (filteredSkills().length === 0) {
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <p>No skills found in this category</p>
      </div>
    }
  `,
  styles: [`
    /* ═══ FILTER PILLS ═══ */
    .skill-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 3rem;
      padding: 0.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
    }

    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .filter-pill::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent-gradient);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    }

    .filter-pill > * {
      position: relative;
      z-index: 1;
    }

    .filter-pill:hover {
      color: var(--text-primary);
      border-color: var(--border-color);
      transform: translateY(-2px);
    }

    .filter-pill.active {
      color: #fff;
      border-color: transparent;
      box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3);
    }

    .filter-pill.active::before {
      opacity: 1;
    }

    .filter-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .filter-count {
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255,255,255,0.15);
      border-radius: 100px;
    }

    .filter-pill:not(.active) .filter-count {
      background: var(--bg-tertiary);
    }

    /* ═══ SKILLS GRID ═══ */
    .skill-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .skill-card-wrapper {
      perspective: 1000px;
    }

    .skill-card {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 1.5rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      transform-style: preserve-3d;
    }

    .skill-card:hover {
      border-color: var(--accent);
      transform: translateY(-8px) rotateX(2deg);
      box-shadow: 0 25px 50px rgba(var(--accent-rgb), 0.15);
    }

    .skill-card.expert {
      border-color: rgba(251, 191, 36, 0.3);
      background: linear-gradient(135deg, var(--bg-card) 0%, rgba(251, 191, 36, 0.05) 100%);
    }

    .skill-card.expert:hover {
      border-color: rgba(251, 191, 36, 0.6);
      box-shadow: 0 25px 50px rgba(251, 191, 36, 0.15);
    }

    /* Card Glow */
    .card-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
        rgba(var(--accent-rgb), 0.1) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 0;
    }

    .skill-card:hover .card-glow {
      opacity: 1;
    }

    /* ═══ SKILL HEADER ═══ */
    .skill-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
      position: relative;
      z-index: 1;
    }

    .skill-icon-container {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-subtle);
      border-radius: 14px;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .skill-category-icon {
      width: 24px;
      height: 24px;
      color: var(--accent);
    }

    .skill-card:hover .skill-icon-container {
      transform: scale(1.1) rotate(-5deg);
      background: var(--accent-gradient);
    }

    .skill-card:hover .skill-category-icon {
      color: #fff;
    }

    .skill-info {
      flex: 1;
      min-width: 0;
    }

    .skill-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .skill-category-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .expertise-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.625rem;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.1));
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 100px;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #fbbf24;
      animation: pulse 2s ease-in-out infinite;
    }

    .badge-icon {
      width: 12px;
      height: 12px;
    }

    /* ═══ PROGRESS RING ═══ */
    .skill-progress {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      display: none; /* Hidden by default, show on hover */
    }

    .skill-card:hover .skill-progress {
      display: block;
    }

    .progress-ring {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .progress-bg {
      fill: none;
      stroke: var(--bg-tertiary);
      stroke-width: 6;
    }

    .progress-fill {
      fill: none;
      stroke: url(#gradient);
      stroke-width: 6;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .progress-center {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .progress-percent {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-tertiary);
    }

    /* ═══ LEVEL BAR ═══ */
    .skill-level-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
      position: relative;
      z-index: 1;
    }

    .level-track {
      display: flex;
      gap: 0.5rem;
    }

    .level-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--bg-tertiary);
      border: 2px solid var(--border-subtle);
      transition: all 0.3s ease;
    }

    .level-dot.filled {
      background: var(--accent-gradient);
      border-color: var(--accent);
      box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.3);
    }

    .level-dot.pulse {
      animation: dotPulse 2s ease-in-out infinite;
    }

    @keyframes dotPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.3); }
      50% { transform: scale(1.2); box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.5); }
    }

    .level-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* ═══ SKILL TAGS ═══ */
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      position: relative;
      z-index: 1;
    }

    .skill-tag {
      padding: 0.25rem 0.625rem;
      font-size: 0.6875rem;
      font-weight: 500;
      background: var(--accent-subtle);
      color: var(--accent);
      border-radius: 100px;
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
    }

    .skill-tag:hover {
      background: var(--accent);
      color: #fff;
      transform: translateY(-2px);
    }

    /* ═══ EMPTY STATE ═══ */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-tertiary);
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 1rem;
      opacity: 0.5;
    }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 768px) {
      .skill-filters {
        gap: 0.5rem;
        padding: 0.375rem;
      }

      .filter-pill {
        padding: 0.5rem 0.875rem;
        font-size: 0.8125rem;
      }

      .filter-pill span:not(.filter-icon):not(.filter-count) {
        display: none;
      }

      .skill-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class SkillGridComponent implements OnInit {
  @Input({ required: true }) skills: Skill[] = [];

  activeCategory = signal<SkillCategory | 'all'>('all');
  hoveredSkill = signal<string | null>(null);

  categories = computed(() => {
    const cats = new Set(this.skills.map(s => s.category));
    return Array.from(cats);
  });

  filteredSkills = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.skills;
    return this.skills.filter(s => s.category === cat);
  });

  ngOnInit(): void {}

  formatCategory(cat: string): string {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      frontend: '<path d="M17 8l4 4m0 0l-4 4m4-4H3"/><path d="M3 4h18v16H3z" stroke-dasharray="4 2"/>',
      backend: '<path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>',
      database: '<path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>',
      cloud: '<path d="M8 19.5c-2.5 0-4.5-2-4.5-4.5 0-2.03 1.34-3.75 3.18-4.32A5.5 5.5 0 0117.5 10c.17 0 .34.01.5.03A4.5 4.5 0 0121.5 14.5c0 2.49-2.01 4.5-4.5 4.5H8z"/>',
      devops: '<path d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-9-9V1.5m0 21V21m-6.343-1.657l-.707.707m13.657-13.657l-.707.707M5.636 5.636l-.707-.707m13.657 13.657l-.707-.707"/>',
      testing: '<path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
      tools: '<path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"/>',
      design: '<path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>',
      all: '<path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>'
    };
    return icons[cat] || icons['all'];
  }

  getCategoryCount(cat: string): number {
    return this.skills.filter(s => s.category === cat).length;
  }

  getLevelLabel(level: number): string {
    const labels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level] || '';
  }
}
