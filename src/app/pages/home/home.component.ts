import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService, SeoService } from '../../core/services';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent, ProjectCardComponent],
  template: `
    @if (profileService.loading()) {
      <div class="loading-state section">
        <div class="container text-center">
          <div class="loader"></div>
          <p class="text-secondary mt-md">Loading profile...</p>
        </div>
      </div>
    } @else if (profileService.error()) {
      <div class="error-state section">
        <div class="container text-center">
          <h2 class="text-h2">Profile not found</h2>
          <p class="text-secondary mt-sm">{{ profileService.error() }}</p>
        </div>
      </div>
    } @else {
      @if (profileService.profile(); as profile) {
      <!-- Hero Section -->
      <section class="hero section">
        <div class="container">
          <div class="hero-content animate-fade-in-up">
            <div class="hero-badge badge" [ngClass]="profile.availability">
              <span class="dot"></span>
              {{ profile.availability === 'available' ? 'Available for work' : profile.availability === 'busy' ? 'Currently busy' : 'Not available' }}
            </div>

            <h1 class="text-display mt-lg">
              Hi, I'm <span class="text-gradient">{{ profile.firstName }}</span>
            </h1>

            <p class="hero-headline text-h3 text-secondary mt-md">
              {{ profile.headline }}
            </p>

            <p class="hero-summary text-body text-secondary mt-md" style="max-width: 640px;">
              {{ profile.summary }}
            </p>

            <div class="hero-actions mt-xl">
              <a [routerLink]="['projects']" class="btn-primary">
                View Projects
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
              <a [routerLink]="['contact']" class="btn-secondary">Get in Touch</a>
              @if (profile.resumeUrl) {
                <a [href]="profile.resumeUrl" target="_blank" class="btn-ghost">
                  Download Resume
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
              }
            </div>

            <div class="hero-socials mt-xl">
              @for (social of profile.socials; track social.platform) {
                <a [href]="social.url" target="_blank" rel="noopener" class="btn-icon" [title]="social.platform">
                  {{ getSocialIcon(social.platform) }}
                </a>
              }
            </div>
          </div>

          <!-- Ambient glow -->
          <div class="hero-glow" aria-hidden="true"></div>
        </div>
      </section>

      <!-- Featured Projects -->
      @if (profileService.featuredProjects().length > 0) {
        <section class="section">
          <div class="container">
            <app-section-header
              label="Featured Work"
              title="Selected Projects"
              subtitle="Highlights from my recent work">
            </app-section-header>

            <div class="grid grid-2">
              @for (project of profileService.featuredProjects(); track project.id; let i = $index) {
                <app-project-card
                  [project]="project"
                  [profileSlug]="profileService.currentSlug()"
                  class="animate-fade-in-up stagger-{{ i + 1 }}">
                </app-project-card>
              }
            </div>

            <div class="text-center mt-xl">
              <a [routerLink]="['projects']" class="btn-secondary">
                View All Projects
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      }

      <!-- Quick Stats -->
      <section class="section">
        <div class="container">
          <div class="stats-grid grid grid-4">
            <div class="stat-card card-flat text-center animate-fade-in-up stagger-1">
              <span class="stat-value text-h1 text-gradient">{{ profileService.experience().length }}+</span>
              <span class="text-body-sm text-secondary">Companies</span>
            </div>
            <div class="stat-card card-flat text-center animate-fade-in-up stagger-2">
              <span class="stat-value text-h1 text-gradient">{{ profileService.projects().length }}+</span>
              <span class="text-body-sm text-secondary">Projects</span>
            </div>
            <div class="stat-card card-flat text-center animate-fade-in-up stagger-3">
              <span class="stat-value text-h1 text-gradient">{{ profileService.skills().length }}+</span>
              <span class="text-body-sm text-secondary">Skills</span>
            </div>
            <div class="stat-card card-flat text-center animate-fade-in-up stagger-4">
              <span class="stat-value text-h1 text-gradient">{{ getYearsOfExperience() }}+</span>
              <span class="text-body-sm text-secondary">Years Exp.</span>
            </div>
          </div>
        </div>
      </section>
      }
    }
  `,
  styles: [`
    .hero {
      position: relative;
      overflow: hidden;
      min-height: calc(100vh - 4rem);
      display: flex;
      align-items: center;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .hero-socials {
      display: flex;
      gap: 0.25rem;
    }

    .hero-glow {
      position: absolute;
      top: 10%;
      right: -10%;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.04;
      filter: blur(120px);
      pointer-events: none;
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 2rem 1rem;
    }

    .loading-state, .error-state {
      min-height: 60vh;
      display: flex;
      align-items: center;
    }

    .loader {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border-subtle);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .hero {
        min-height: auto;
        padding-top: 3rem;
      }
    }
  `],
})
export class HomeComponent implements OnInit {
  profileService = inject(ProfileService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    const profile = this.profileService.profile();
    if (profile) {
      this.seoService.update({
        title: `${profile.firstName} ${profile.lastName}`,
        description: profile.summary,
      });
    }
  }

  getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      linkedin: '🔗',
      github: '💻',
      twitter: '🐦',
      email: '✉️',
      whatsapp: '💬',
      website: '🌐',
      dribbble: '🎨',
      youtube: '📺',
      medium: '📝',
      stackoverflow: '📚',
    };
    return icons[platform] || '🔗';
  }

  getYearsOfExperience(): number {
    const experiences = this.profileService.experience();
    if (!experiences.length) return 0;
    const earliest = experiences.reduce((min, e) =>
      new Date(e.startDate) < new Date(min.startDate) ? e : min
    );
    const years = Math.floor(
      (Date.now() - new Date(earliest.startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    return years;
  }
}
