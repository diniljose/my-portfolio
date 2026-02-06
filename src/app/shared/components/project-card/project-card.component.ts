import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/p', profileSlug, 'projects', project.slug]" class="project-card card">
      @if (project.thumbnail) {
        <div class="card-image">
          <img [src]="project.thumbnail" [alt]="project.title" loading="lazy" />
        </div>
      } @else {
        <div class="card-image placeholder">
          <span class="placeholder-icon">{{ project.title[0] }}</span>
        </div>
      }
      <div class="card-body">
        <div class="card-meta">
          <span class="chip">{{ project.category }}</span>
          @if (project.featured) {
            <span class="chip" style="background: rgba(251, 191, 36, 0.12); color: var(--warning);">★ Featured</span>
          }
        </div>
        <h3 class="text-h4">{{ project.title }}</h3>
        <p class="text-body-sm text-secondary card-desc">{{ project.description }}</p>
        <div class="card-tech">
          @for (tech of project.techStack | slice:0:4; track tech) {
            <span class="chip-outline">{{ tech }}</span>
          }
          @if (project.techStack.length > 4) {
            <span class="chip-outline">+{{ project.techStack.length - 4 }}</span>
          }
        </div>
      </div>
    </a>
  `,
  styles: [`
    .project-card {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      padding: 0;
    }

    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: var(--bg-tertiary);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      &.placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .placeholder-icon {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent);
        opacity: 0.3;
      }
    }

    .project-card:hover .card-image img {
      transform: scale(1.05);
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      flex: 1;
    }

    .card-meta {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }

    .card-desc {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-tech {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
      margin-top: auto;
    }
  `],
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  @Input() profileSlug = '';
}
