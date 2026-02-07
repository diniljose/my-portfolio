import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services';
import { SkillGridComponent } from '../../shared/components/skill-grid/skill-grid.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RouterLink, SkillGridComponent],
  template: `
    <!-- Hero Section -->
    <section class="skills-hero">
      <div class="container">
        <div class="hero-content animate-fade-in-up">
          <span class="hero-label">Technical Arsenal</span>
          <h1 class="hero-title">
            Skills & <span class="text-gradient-animated">Expertise</span>
          </h1>
          <p class="hero-subtitle">
            A comprehensive overview of technologies, frameworks, and tools I've mastered 
            throughout my {{ getYearsOfExperience() }}+ years of professional experience.
          </p>
        </div>

        <!-- Quick Stats -->
        <div class="skill-stats animate-fade-in-up stagger-2">
          <div class="stat-item">
            <span class="stat-number">{{ getSkillsByLevel(5).length }}</span>
            <span class="stat-label">Expert Level</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ getSkillsByLevel(4).length }}</span>
            <span class="stat-label">Advanced</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ getCategoryCount() }}</span>
            <span class="stat-label">Categories</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ profileService.skills().length }}</span>
            <span class="stat-label">Total Skills</span>
          </div>
        </div>
      </div>

      <!-- Background Decoration -->
      <div class="hero-bg" aria-hidden="true">
        <div class="bg-gradient"></div>
        <div class="bg-grid"></div>
      </div>
    </section>

    <!-- Skills Grid Section -->
    <section class="section skills-content">
      <div class="container">
        <app-skill-grid [skills]="profileService.skills()"></app-skill-grid>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-card animate-fade-in-up">
          <div class="cta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            </svg>
          </div>
          <h2 class="cta-title">Want to see these skills in action?</h2>
          <p class="cta-text">Check out my projects to see how I've applied these technologies to solve real-world problems.</p>
          <a routerLink="../projects" class="cta-btn">
            View Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .skills-hero {
      position: relative;
      padding: 6rem 0 4rem;
      overflow: hidden;
    }

    .hero-content {
      text-align: center;
      position: relative;
      z-index: 1;
      max-width: 700px;
      margin: 0 auto;
    }

    .hero-label {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--accent-subtle);
      color: var(--accent);
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: 100px;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    /* Skill Stats */
    .skill-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      max-width: 700px;
      margin: 3rem auto 0;
      position: relative;
      z-index: 1;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 800;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.8125rem;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border-subtle);
    }

    /* Background */
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .bg-gradient {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 600px;
      background: radial-gradient(ellipse, rgba(var(--accent-rgb), 0.08) 0%, transparent 70%);
    }

    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(var(--border-subtle) 1px, transparent 1px),
        linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
      background-size: 60px 60px;
      opacity: 0.3;
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    }

    /* Skills Content */
    .skills-content {
      background: var(--bg-secondary);
    }

    /* CTA Section */
    .cta-section {
      background: var(--bg-primary);
    }

    .cta-card {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 24px;
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
      color: var(--accent);

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .cta-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
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
      padding: 0.875rem 1.75rem;
      background: var(--accent-gradient);
      color: #fff;
      font-weight: 600;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.3);
    }

    @media (max-width: 640px) {
      .skill-stats {
        gap: 1.5rem;
        padding: 1.5rem;
      }

      .stat-divider {
        display: none;
      }

      .stat-item {
        flex: 1;
        min-width: 80px;
      }
    }
  `],
})
export class SkillsComponent {
  profileService = inject(ProfileService);

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

  getSkillsByLevel(level: number): any[] {
    return this.profileService.skills().filter(s => s.level === level);
  }

  getCategoryCount(): number {
    const categories = new Set(this.profileService.skills().map(s => s.category));
    return categories.size;
  }
}
