import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortfolioData, Profile, Project, Experience, Skill, Education, Certification, Testimonial } from '../../core/models';
import { environment } from '../../../environments/environment';
import { catchError, tap, of } from 'rxjs';

const STORAGE_PREFIX = 'folio-admin-data';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private http = inject(HttpClient);

  private _portfolioData = signal<PortfolioData | null>(null);
  private _currentSlug = signal<string>('');
  private _loading = signal(false);
  private _dirty = signal(false);
  private _lastSaved = signal<Date | null>(null);

  readonly portfolioData = this._portfolioData.asReadonly();
  readonly currentSlug = this._currentSlug.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly dirty = this._dirty.asReadonly();
  readonly lastSaved = this._lastSaved.asReadonly();

  readonly profile = computed(() => this._portfolioData()?.profile ?? null);
  readonly projects = computed(() => this._portfolioData()?.projects ?? []);
  readonly experience = computed(() => this._portfolioData()?.experience ?? []);
  readonly skills = computed(() => this._portfolioData()?.skills ?? []);
  readonly education = computed(() => this._portfolioData()?.education ?? []);
  readonly certifications = computed(() => this._portfolioData()?.certifications ?? []);
  readonly testimonials = computed(() => this._portfolioData()?.testimonials ?? []);

  readonly stats = computed(() => {
    const data = this._portfolioData();
    if (!data) return null;
    return {
      projects: data.projects.length,
      skills: data.skills.length,
      experience: data.experience.length,
      education: data.education.length,
      certifications: data.certifications.length,
      testimonials: data.testimonials.length,
      featuredProjects: data.projects.filter(p => p.featured).length,
    };
  });

  /** Load portfolio data — first checks localStorage for admin overrides, then falls back to JSON */
  loadData(slug: string): void {
    this._currentSlug.set(slug);
    this._loading.set(true);

    // Check localStorage first
    const saved = this.getFromStorage(slug);
    if (saved) {
      this._portfolioData.set(saved);
      this._loading.set(false);
      this._dirty.set(false);
      return;
    }

    // Fall back to source JSON
    const url = environment.dataMode === 'local'
      ? `assets/profiles/${slug}.json`
      : `${environment.apiUrl}/profiles/${slug}`;

    this.http.get<PortfolioData>(url).pipe(
      tap(data => {
        this._portfolioData.set(data);
        this._loading.set(false);
        this._dirty.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  /** Get list of available profiles */
  getProfileList(): string[] {
    if (typeof localStorage === 'undefined') return [];
    const profiles: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${STORAGE_PREFIX}-`)) {
        profiles.push(key.replace(`${STORAGE_PREFIX}-`, ''));
      }
    }
    // Also add known defaults
    if (!profiles.includes('dinil')) profiles.push('dinil');
    if (!profiles.includes('sarah')) profiles.push('sarah');
    return profiles;
  }

  // ─── Profile CRUD ───────────────────────────────────────────────────────────

  updateProfile(profile: Profile): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({ ...data, profile });
    this._dirty.set(true);
  }

  // ─── Projects CRUD ──────────────────────────────────────────────────────────

  addProject(project: Project): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({ ...data, projects: [...data.projects, project] });
    this._dirty.set(true);
  }

  updateProject(project: Project): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({
      ...data,
      projects: data.projects.map(p => p.id === project.id ? project : p),
    });
    this._dirty.set(true);
  }

  deleteProject(id: string): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({
      ...data,
      projects: data.projects.filter(p => p.id !== id),
    });
    this._dirty.set(true);
  }

  // ─── Experience CRUD ────────────────────────────────────────────────────────

  addExperience(exp: Experience): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({ ...data, experience: [...data.experience, exp] });
    this._dirty.set(true);
  }

  updateExperience(exp: Experience): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({
      ...data,
      experience: data.experience.map(e => e.id === exp.id ? exp : e),
    });
    this._dirty.set(true);
  }

  deleteExperience(id: string): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({
      ...data,
      experience: data.experience.filter(e => e.id !== id),
    });
    this._dirty.set(true);
  }

  // ─── Skills CRUD ────────────────────────────────────────────────────────────

  addSkill(skill: Skill): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({ ...data, skills: [...data.skills, skill] });
    this._dirty.set(true);
  }

  updateSkill(oldName: string, skill: Skill): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({
      ...data,
      skills: data.skills.map(s => s.name === oldName ? skill : s),
    });
    this._dirty.set(true);
  }

  deleteSkill(name: string): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({
      ...data,
      skills: data.skills.filter(s => s.name !== name),
    });
    this._dirty.set(true);
  }

  // ─── Education CRUD ─────────────────────────────────────────────────────────

  updateEducation(education: Education[]): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({ ...data, education });
    this._dirty.set(true);
  }

  // ─── Certifications CRUD ────────────────────────────────────────────────────

  updateCertifications(certifications: Certification[]): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({ ...data, certifications });
    this._dirty.set(true);
  }

  // ─── Testimonials CRUD ──────────────────────────────────────────────────────

  updateTestimonials(testimonials: Testimonial[]): void {
    const data = this._portfolioData();
    if (!data) return;
    this._portfolioData.set({ ...data, testimonials });
    this._dirty.set(true);
  }

  // ─── Persistence ────────────────────────────────────────────────────────────

  save(): boolean {
    const slug = this._currentSlug();
    const data = this._portfolioData();
    if (!slug || !data) return false;

    this.saveToStorage(slug, data);
    this._dirty.set(false);
    this._lastSaved.set(new Date());
    return true;
  }

  /** Export current data as downloadable JSON */
  exportJson(): void {
    const data = this._portfolioData();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this._currentSlug()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Import JSON data from file */
  importJson(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as PortfolioData;
          if (data.profile && data.skills && data.projects) {
            this._portfolioData.set(data);
            this._dirty.set(true);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }

  /** Reset to original JSON (discard localStorage edits) */
  resetToOriginal(): void {
    const slug = this._currentSlug();
    if (!slug) return;
    this.removeFromStorage(slug);
    this.loadData(slug);
  }

  // ─── Storage Helpers ────────────────────────────────────────────────────────

  private getFromStorage(slug: string): PortfolioData | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}-${slug}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(slug: string, data: PortfolioData): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(`${STORAGE_PREFIX}-${slug}`, JSON.stringify(data));
  }

  private removeFromStorage(slug: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(`${STORAGE_PREFIX}-${slug}`);
  }
}
