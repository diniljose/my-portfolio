import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/', 'projects', project.slug]" class="project-card">
      <!-- Card Image -->
      <div class="card-image-container">
        @if (project.thumbnail) {
          <img [src]="project.thumbnail" [alt]="project.title" loading="lazy" class="card-image" />
        } @else {
          <div class="card-image-placeholder">
            <span class="placeholder-letter">{{ project.title[0] }}</span>
            <div class="placeholder-pattern"></div>
          </div>
        }
        
        <!-- Overlay -->
        <div class="card-overlay">
          <span class="view-project">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
            View Project
          </span>
        </div>

        <!-- Badges -->
        <div class="card-badges">
          <span class="badge-category">{{ project.category }}</span>
          @if (project.featured) {
            <span class="badge-featured">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Featured
            </span>
          }
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <h3 class="card-title">{{ project.title }}</h3>
        <p class="card-description">{{ project.description }}</p>
        
        <!-- Tech Stack -->
        <div class="card-tech">
          @for (tech of project.techStack | slice:0:4; track tech; let i = $index) {
            <span class="tech-tag" [style.animation-delay]="(i * 0.05) + 's'">{{ tech }}</span>
          }
          @if (project.techStack.length > 4) {
            <span class="tech-more">+{{ project.techStack.length - 4 }}</span>
          }
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          @if (project.role) {
            <span class="card-role">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {{ project.role }}
            </span>
          }
          <span class="card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
            </svg>
          </span>
        </div>
      </div>

      <!-- Hover Glow -->
      <div class="card-glow" aria-hidden="true"></div>
    </a>
  `,
  styles: [`
    .project-card {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 24px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .project-card:hover {
      border-color: var(--accent);
      transform: translateY(-12px);
      box-shadow: 0 30px 60px rgba(var(--accent-rgb), 0.15);
    }

    /* Card Image */
    .card-image-container {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: var(--bg-tertiary);
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-image[src^="data:image/svg"] {
      object-fit: contain;
      background: #0f172a;
      padding: 0;
    }

    .project-card:hover .card-image {
      transform: scale(1.1);
    }

    .card-image-placeholder {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--accent-subtle) 100%);
    }

    .placeholder-letter {
      font-size: 4rem;
      font-weight: 800;
      color: var(--accent);
      opacity: 0.3;
      transition: all 0.4s ease;
    }

    .project-card:hover .placeholder-letter {
      opacity: 0.5;
      transform: scale(1.1);
    }

    .placeholder-pattern {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(var(--accent-rgb), 0.1) 0%, transparent 40%),
        radial-gradient(circle at 80% 20%, rgba(var(--accent-rgb), 0.08) 0%, transparent 40%);
    }

    /* Overlay */
    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.6) 100%
      );
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 2rem;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .project-card:hover .card-overlay {
      opacity: 1;
    }

    .view-project {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.95);
      color: #000;
      border-radius: 100px;
      font-size: 0.875rem;
      font-weight: 600;
      transform: translateY(20px);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .project-card:hover .view-project {
      transform: translateY(0);
    }

    /* Badges */
    .card-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .badge-category {
      padding: 0.375rem 0.875rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.95);
      color: #000;
      border-radius: 100px;
      backdrop-filter: blur(10px);
    }

    .badge-featured {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: #000;
      border-radius: 100px;
    }

    /* Card Content */
    .card-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
      transition: color 0.3s ease;
    }

    .project-card:hover .card-title {
      color: var(--accent);
    }

    .card-description {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Tech Stack */
    .card-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: auto;
      padding-top: 0.75rem;
    }

    .tech-tag {
      padding: 0.25rem 0.625rem;
      font-size: 0.6875rem;
      font-weight: 500;
      background: var(--accent-subtle);
      color: var(--accent);
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .project-card:hover .tech-tag {
      background: var(--accent);
      color: #fff;
    }

    .tech-more {
      padding: 0.25rem 0.625rem;
      font-size: 0.6875rem;
      font-weight: 600;
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      border-radius: 6px;
    }

    /* Card Footer */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }

    .card-role {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: var(--text-tertiary);
    }

    .card-arrow {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-tertiary);
      border-radius: 8px;
      color: var(--text-tertiary);
      transition: all 0.3s ease;
    }

    .project-card:hover .card-arrow {
      background: var(--accent);
      color: #fff;
      transform: rotate(-45deg);
    }

    /* Card Glow */
    .card-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle at 50% 0%,
        rgba(var(--accent-rgb), 0.1) 0%,
        transparent 50%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 0;
    }

    .project-card:hover .card-glow {
      opacity: 1;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .card-image-container {
        height: 180px;
      }

      .card-content {
        padding: 1.25rem;
      }

      .card-title {
        font-size: 1.125rem;
      }
    }
  `],
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
