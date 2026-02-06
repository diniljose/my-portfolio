import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent, ProjectCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <app-section-header
          label="Projects"
          title="My Work"
          subtitle="A selection of projects I've worked on">
        </app-section-header>

        <!-- Filters -->
        <div class="projects-toolbar">
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              class="search-input" />
          </div>

          <div class="category-filters">
            <button
              class="filter-btn"
              [class.active]="activeCategory() === 'all'"
              (click)="activeCategory.set('all')">
              All
            </button>
            @for (cat of categories(); track cat) {
              <button
                class="filter-btn"
                [class.active]="activeCategory() === cat"
                (click)="activeCategory.set(cat)">
                {{ cat }}
              </button>
            }
          </div>
        </div>

        <!-- Projects Grid -->
        @if (filteredProjects().length > 0) {
          <div class="grid grid-2 mt-xl">
            @for (project of filteredProjects(); track project.id; let i = $index) {
              <app-project-card
                [project]="project"
                [profileSlug]="profileService.currentSlug()"
                class="animate-fade-in-up stagger-{{ (i % 6) + 1 }}">
              </app-project-card>
            }
          </div>
        } @else {
          <div class="empty-state mt-2xl text-center">
            <p class="text-h3">No projects found</p>
            <p class="text-secondary mt-sm">Try adjusting your search or filter.</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .projects-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem;
      border-radius: 10px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-subtle);
      flex: 1;
      min-width: 200px;
      max-width: 320px;
      transition: border-color 0.2s;

      &:focus-within {
        border-color: var(--accent);
      }

      svg {
        color: var(--text-tertiary);
        flex-shrink: 0;
      }
    }

    .search-input {
      background: none;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 0.875rem;
      width: 100%;

      &::placeholder {
        color: var(--text-tertiary);
      }
    }

    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .filter-btn {
      padding: 0.375rem 0.875rem;
      border-radius: 100px;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-tertiary);
      border: 1px solid transparent;
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-color);
      }

      &.active {
        background: var(--accent-subtle);
        color: var(--accent);
        border-color: var(--accent);
      }
    }

    .empty-state {
      padding: 4rem 0;
    }
  `],
})
export class ProjectsComponent {
  profileService = inject(ProfileService);

  searchQuery = signal('');
  activeCategory = signal('all');

  categories = computed(() => {
    const cats = new Set(this.profileService.projects().map(p => p.category));
    return Array.from(cats);
  });

  filteredProjects = computed(() => {
    let projects = this.profileService.projects();
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();

    if (cat !== 'all') {
      projects = projects.filter(p => p.category === cat);
    }

    if (q) {
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some(t => t.toLowerCase().includes(q))
      );
    }

    return projects;
  });
}
