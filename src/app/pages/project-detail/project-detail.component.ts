import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileService, SeoService } from '../../core/services';
import { Project } from '../../core/models';
import { marked } from 'marked';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (project(); as p) {
      <section class="section">
        <div class="container container-sm">
          <!-- Back -->
          <a [routerLink]="['/p', profileService.currentSlug(), 'projects']" class="back-link btn-ghost mb-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to Projects
          </a>

          <!-- Header -->
          <div class="project-header animate-fade-in-up">
            <div class="project-meta">
              <span class="chip">{{ p.category }}</span>
              @if (p.featured) {
                <span class="chip" style="background: rgba(251, 191, 36, 0.12); color: var(--warning);">★ Featured</span>
              }
            </div>
            <h1 class="text-h1 mt-md">{{ p.title }}</h1>
            <p class="text-body text-secondary mt-md">{{ p.description }}</p>
          </div>

          <!-- Info Grid -->
          <div class="info-grid mt-xl animate-fade-in-up stagger-1">
            <div class="info-card card-flat">
              <span class="text-caption text-tertiary">Role</span>
              <span class="text-body-sm">{{ p.role }}</span>
            </div>
            @if (p.startDate) {
              <div class="info-card card-flat">
                <span class="text-caption text-tertiary">Timeline</span>
                <span class="text-body-sm">
                  {{ formatDate(p.startDate) }} — {{ p.endDate ? formatDate(p.endDate) : 'Ongoing' }}
                </span>
              </div>
            }
          </div>

          <!-- Tech Stack -->
          <div class="mt-xl animate-fade-in-up stagger-2">
            <h3 class="text-h4 mb-md">Tech Stack</h3>
            <div class="tech-list">
              @for (tech of p.techStack; track tech) {
                <span class="chip">{{ tech }}</span>
              }
            </div>
          </div>

          <!-- Highlights -->
          @if (p.highlights.length > 0) {
            <div class="mt-xl animate-fade-in-up stagger-3">
              <h3 class="text-h4 mb-md">Highlights</h3>
              <ul class="highlights-list">
                @for (h of p.highlights; track h) {
                  <li class="text-body-sm">
                    <span class="highlight-icon">▸</span>
                    {{ h }}
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Links -->
          @if (p.links.length > 0) {
            <div class="mt-xl animate-fade-in-up stagger-4">
              <h3 class="text-h4 mb-md">Links</h3>
              <div class="links-row">
                @for (link of p.links; track link.url) {
                  <a [href]="link.url" target="_blank" rel="noopener" class="btn-secondary">
                    {{ link.label }}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                }
              </div>
            </div>
          }

          <!-- Gallery -->
          @if (p.images.length > 0) {
            <div class="mt-xl animate-fade-in-up stagger-5">
              <h3 class="text-h4 mb-md">Gallery</h3>
              <div class="gallery">
                @for (img of p.images; track img) {
                  <div class="gallery-item">
                    <img [src]="img" [alt]="p.title + ' screenshot'" loading="lazy" />
                  </div>
                }
              </div>
            </div>
          }

          <!-- Case Study -->
          @if (p.caseStudy) {
            <div class="mt-2xl animate-fade-in-up stagger-6">
              <h3 class="text-h4 mb-md">Case Study</h3>
              <div class="markdown-content" [innerHTML]="renderedCaseStudy()"></div>
            </div>
          }
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container text-center" style="min-height: 50vh; display: flex; align-items: center; justify-content: center;">
          <div>
            <h2 class="text-h2">Project not found</h2>
            <a [routerLink]="['/p', profileService.currentSlug(), 'projects']" class="btn-primary mt-lg">
              View All Projects
            </a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .back-link {
      display: inline-flex;
    }

    .project-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-card {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .highlights-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .highlights-list li {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .highlight-icon {
      color: var(--accent);
      flex-shrink: 0;
    }

    .links-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .gallery-item {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s;
      }

      &:hover img {
        transform: scale(1.03);
      }
    }
  `],
})
export class ProjectDetailComponent implements OnInit {
  profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);

  project = signal<Project | null>(null);
  renderedCaseStudy = signal('');

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('projectSlug');
      const found = this.profileService.projects().find(p => p.slug === slug);
      this.project.set(found || null);

      if (found) {
        this.seoService.update({
          title: found.title,
          description: found.description,
        });

        if (found.caseStudy) {
          this.renderedCaseStudy.set(marked(found.caseStudy) as string);
        }
      }
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
