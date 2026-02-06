import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, tap, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { PortfolioData, Profile } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);

  // State
  private _currentSlug = signal<string>(environment.defaultProfile);
  private _portfolio = signal<PortfolioData | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public selectors
  readonly currentSlug = this._currentSlug.asReadonly();
  readonly portfolio = this._portfolio.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly profile = computed(() => this._portfolio()?.profile ?? null);
  readonly skills = computed(() => this._portfolio()?.skills ?? []);
  readonly experience = computed(() => this._portfolio()?.experience ?? []);
  readonly projects = computed(() => this._portfolio()?.projects ?? []);
  readonly education = computed(() => this._portfolio()?.education ?? []);
  readonly certifications = computed(() => this._portfolio()?.certifications ?? []);
  readonly testimonials = computed(() => this._portfolio()?.testimonials ?? []);

  readonly featuredProjects = computed(() =>
    this.projects().filter(p => p.featured)
  );

  loadProfile(slug: string): void {
    if (this._currentSlug() === slug && this._portfolio()) return;

    this._currentSlug.set(slug);
    this._loading.set(true);
    this._error.set(null);

    // Check localStorage for admin-edited data first
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(`folio-admin-data-${slug}`);
        if (saved) {
          const data = JSON.parse(saved) as PortfolioData;
          this._portfolio.set(data);
          this._loading.set(false);
          return;
        }
      } catch { /* fall through to HTTP */ }
    }

    const source$ = environment.dataMode === 'local'
      ? this.http.get<PortfolioData>(`assets/profiles/${slug}.json`)
      : this.http.get<PortfolioData>(`${environment.apiUrl}/profiles/${slug}`);

    source$.pipe(
      tap(data => {
        this._portfolio.set(data);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set(`Profile "${slug}" not found.`);
        this._loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  getProjectBySlug(slug: string): Observable<PortfolioData['projects'][0] | undefined> {
    return of(this.projects().find(p => p.slug === slug));
  }
}
