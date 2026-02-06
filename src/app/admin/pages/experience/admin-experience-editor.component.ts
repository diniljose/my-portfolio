import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { Experience } from '../../../core/models';

@Component({
  selector: 'app-admin-experience-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor">
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>Experience</h1>
            <p class="text-secondary">Manage your work experience entries</p>
          </div>
          <button class="btn btn-accent" (click)="openNew()">+ New Experience</button>
        </div>
      </div>

      <!-- Experience List -->
      @if (!editing()) {
        <div class="timeline-list">
          @for (exp of dataService.experience(); track exp.id) {
            <div class="timeline-card">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="card-header">
                  <div>
                    <h3 class="card-title">{{ exp.role }}</h3>
                    <p class="card-subtitle">{{ exp.company }} · {{ exp.location }}</p>
                  </div>
                  <span class="date-range">{{ exp.startDate | slice:0:7 }} — {{ exp.endDate ? (exp.endDate | slice:0:7) : 'Present' }}</span>
                </div>
                <p class="card-desc">{{ exp.description | slice:0:150 }}{{ exp.description.length > 150 ? '...' : '' }}</p>
                <div class="card-tags">
                  @for (tech of exp.technologies.slice(0, 6); track tech) {
                    <span class="chip chip-sm">{{ tech }}</span>
                  }
                </div>
                <div class="card-actions">
                  <button class="btn btn-sm btn-ghost" (click)="openEdit(exp)">Edit</button>
                  <button class="btn btn-sm btn-danger-ghost" (click)="onDelete(exp.id)">Delete</button>
                </div>
              </div>
            </div>
          }
          @empty {
            <div class="empty-state">
              <p>No experience entries yet.</p>
              <button class="btn btn-accent" (click)="openNew()">Add your first experience</button>
            </div>
          }
        </div>
      }

      <!-- Edit Form -->
      @if (editing(); as exp) {
        <div class="form-card">
          <div class="form-card-header">
            <h2>{{ isNew() ? 'New Experience' : 'Edit Experience' }}</h2>
            <button class="btn-icon" (click)="closeEdit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <form (ngSubmit)="onSave()" class="editor-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Role / Title *</label>
                <input type="text" [(ngModel)]="exp.role" name="role" required>
              </div>
              <div class="form-group">
                <label>Company *</label>
                <input type="text" [(ngModel)]="exp.company" name="company" required>
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="exp.location" name="location">
              </div>
              <div class="form-group">
                <label>Company Logo URL</label>
                <input type="url" [(ngModel)]="exp.logo" name="logo">
              </div>
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" [(ngModel)]="exp.startDate" name="startDate">
              </div>
              <div class="form-group">
                <label>End Date (leave empty for Present)</label>
                <input type="date" [(ngModel)]="exp.endDate" name="endDate">
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea [(ngModel)]="exp.description" name="description" rows="3"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Key Achievements (one per line)</label>
                <textarea [ngModel]="exp.achievements.join('\n')" (ngModelChange)="exp.achievements = splitNewline($event)" name="achievements" rows="5"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Technologies (comma-separated)</label>
                <input type="text" [ngModel]="exp.technologies.join(', ')" (ngModelChange)="exp.technologies = splitComma($event)" name="technologies">
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-accent">{{ isNew() ? 'Create' : 'Update' }}</button>
              <button type="button" class="btn btn-ghost" (click)="closeEdit()">Cancel</button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .editor { max-width: 900px; }

    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem; }
    .page-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .text-secondary { color: var(--text-secondary); font-size: 0.875rem; }

    .timeline-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
      padding-left: 1.5rem;

      &::before {
        content: '';
        position: absolute;
        left: 7px;
        top: 8px;
        bottom: 8px;
        width: 2px;
        background: var(--border-subtle);
      }
    }

    .timeline-card {
      position: relative;
      display: flex;
      gap: 1rem;
    }

    .timeline-dot {
      position: absolute;
      left: -1.5rem;
      top: 1.25rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--accent);
      border: 2px solid var(--bg-primary);
      z-index: 1;
    }

    .timeline-content {
      flex: 1;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.25rem;
      transition: border-color 0.2s;
      &:hover { border-color: var(--border-color); }
    }

    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .card-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .card-subtitle { font-size: 0.8125rem; color: var(--text-secondary); margin: 0.125rem 0 0; }
    .date-range { font-size: 0.75rem; color: var(--text-tertiary); white-space: nowrap; }
    .card-desc { font-size: 0.8125rem; color: var(--text-secondary); margin: 0.5rem 0; line-height: 1.5; }
    .card-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.75rem; }
    .card-actions { display: flex; gap: 0.5rem; }

    .chip { padding: 0.2rem 0.625rem; border-radius: 6px; font-size: 0.75rem; background: var(--bg-tertiary); color: var(--text-secondary); }
    .chip-sm { padding: 0.125rem 0.5rem; font-size: 0.6875rem; }

    .empty-state { text-align: center; padding: 3rem; color: var(--text-tertiary); }

    .form-card { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.5rem; }
    .form-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .form-card-header h2 { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin: 0; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .full-width { grid-column: 1 / -1; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-group label { font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); }

    .form-group input, .form-group textarea, .form-group select {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      font-family: inherit;
      outline: none;
      &:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }
    }

    .form-group textarea { resize: vertical; }

    .btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
    .btn-accent { background: var(--accent); color: white; &:hover { opacity: 0.9; } }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-subtle); &:hover { background: var(--bg-tertiary); } }
    .btn-danger-ghost { background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-subtle); &:hover { color: var(--error); border-color: var(--error); } }
    .btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: var(--text-tertiary); &:hover { background: var(--bg-tertiary); color: var(--text-primary); } }
    .form-actions { display: flex; gap: 0.75rem; }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class AdminExperienceEditorComponent {
  dataService = inject(AdminDataService);
  editing = signal<Experience | null>(null);
  isNew = signal(false);

  openNew(): void {
    this.isNew.set(true);
    this.editing.set({
      id: crypto.randomUUID(),
      company: '',
      role: '',
      location: '',
      startDate: '',
      description: '',
      achievements: [],
      technologies: [],
    });
  }

  openEdit(exp: Experience): void {
    this.isNew.set(false);
    this.editing.set(JSON.parse(JSON.stringify(exp)));
  }

  closeEdit(): void {
    this.editing.set(null);
    this.isNew.set(false);
  }

  splitComma(value: string): string[] {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }

  splitNewline(value: string): string[] {
    return value.split('\n').filter(Boolean);
  }

  onSave(): void {
    const exp = this.editing();
    if (!exp) return;

    if (this.isNew()) {
      this.dataService.addExperience(exp);
    } else {
      this.dataService.updateExperience(exp);
    }

    this.closeEdit();
  }

  onDelete(id: string): void {
    if (confirm('Delete this experience entry?')) {
      this.dataService.deleteExperience(id);
    }
  }
}
