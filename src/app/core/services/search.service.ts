import { Injectable, signal, computed, inject } from '@angular/core';
import { ProfileService } from './profile.service';
import { SearchResult } from '../models';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private profileService = inject(ProfileService);

  private _query = signal('');
  private _isOpen = signal(false);

  readonly query = this._query.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();

  readonly results = computed<SearchResult[]>(() => {
    const q = this._query().toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const results: SearchResult[] = [];
    const slug = this.profileService.currentSlug();

    // Search projects
    this.profileService.projects().forEach(p => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'project',
          title: p.title,
          subtitle: p.category + ' · ' + p.techStack.slice(0, 3).join(', '),
          route: `/p/${slug}/projects/${p.slug}`,
          icon: '📦',
        });
      }
    });

    // Search skills
    this.profileService.skills().forEach(s => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      ) {
        results.push({
          type: 'skill',
          title: s.name,
          subtitle: s.category,
          route: `/p/${slug}/skills`,
          icon: '⚡',
        });
      }
    });

    // Search experience
    this.profileService.experience().forEach(e => {
      if (
        e.company.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.technologies.some(t => t.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'experience',
          title: e.role,
          subtitle: e.company,
          route: `/p/${slug}/experience`,
          icon: '💼',
        });
      }
    });

    return results.slice(0, 12);
  });

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
    this._query.set('');
  }

  toggle(): void {
    if (this._isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  setQuery(q: string): void {
    this._query.set(q);
  }
}
