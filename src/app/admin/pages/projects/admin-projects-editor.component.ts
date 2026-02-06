import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { Project, ProjectLink } from '../../../core/models';

@Component({
  selector: 'app-admin-projects-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor">
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>Projects</h1>
            <p class="text-secondary">Manage your portfolio projects</p>
          </div>
          <button class="btn btn-accent" (click)="openNew()">+ New Project</button>
        </div>
      </div>

      <!-- Projects List -->
      @if (!editing()) {
        <div class="list-grid">
          @for (project of dataService.projects(); track project.id) {
            <div class="list-card">
              <div class="card-header">
                <div class="card-title-row">
                  <h3 class="card-title">{{ project.title }}</h3>
                  @if (project.featured) {
                    <span class="badge badge-accent">★ Featured</span>
                  }
                </div>
                <span class="chip">{{ project.category }}</span>
              </div>
              <p class="card-desc">{{ project.description | slice:0:120 }}{{ project.description.length > 120 ? '...' : '' }}</p>
              <div class="card-tags">
                @for (tech of project.techStack.slice(0, 5); track tech) {
                  <span class="chip chip-sm">{{ tech }}</span>
                }
              </div>
              <div class="card-actions">
                <button class="btn btn-sm btn-ghost" (click)="openEdit(project)">Edit</button>
                <button class="btn btn-sm btn-danger-ghost" (click)="onDelete(project.id)">Delete</button>
              </div>
            </div>
          }
          @empty {
            <div class="empty-state">
              <p>No projects yet.</p>
              <button class="btn btn-accent" (click)="openNew()">Add your first project</button>
            </div>
          }
        </div>
      }

      <!-- Edit Form -->
      @if (editing(); as proj) {
        <div class="form-card">
          <div class="form-card-header">
            <h2>{{ isNew() ? 'New Project' : 'Edit Project' }}</h2>
            <button class="btn-icon" (click)="closeEdit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <form (ngSubmit)="onSave()" class="editor-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Title *</label>
                <input type="text" [(ngModel)]="proj.title" name="title" required>
              </div>
              <div class="form-group">
                <label>Slug *</label>
                <input type="text" [(ngModel)]="proj.slug" name="slug" required>
              </div>
              <div class="form-group">
                <label>Category</label>
                <input type="text" [(ngModel)]="proj.category" name="category" placeholder="e.g. Web App, Mobile, API">
              </div>
              <div class="form-group">
                <label>Role</label>
                <input type="text" [(ngModel)]="proj.role" name="role" placeholder="e.g. Lead Developer">
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea [(ngModel)]="proj.description" name="description" rows="3"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Tech Stack (comma-separated)</label>
                <input type="text" [ngModel]="proj.techStack.join(', ')" (ngModelChange)="proj.techStack = splitComma($event)" name="techStack">
              </div>
              <div class="form-group full-width">
                <label>Highlights (one per line)</label>
                <textarea [ngModel]="proj.highlights.join('\n')" (ngModelChange)="proj.highlights = splitNewline($event)" name="highlights" rows="4"></textarea>
              </div>
              <div class="form-group">
                <label>Thumbnail URL</label>
                <input type="url" [(ngModel)]="proj.thumbnail" name="thumbnail">
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="proj.featured" name="featured">
                  Featured project
                </label>
              </div>
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" [(ngModel)]="proj.startDate" name="startDate">
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="proj.endDate" name="endDate">
              </div>
            </div>

            <!-- Links -->
            <div class="sub-section">
              <div class="sub-section-header">
                <h3>Links</h3>
                <button type="button" class="btn btn-sm btn-ghost" (click)="addLink(proj)">+ Add</button>
              </div>
              @for (link of proj.links; track $index; let i = $index) {
                <div class="inline-row">
                  <select [(ngModel)]="link.type" [name]="'link-type-'+i">
                    <option value="live">Live</option>
                    <option value="github">GitHub</option>
                    <option value="demo">Demo</option>
                    <option value="docs">Docs</option>
                    <option value="other">Other</option>
                  </select>
                  <input [(ngModel)]="link.url" [name]="'link-url-'+i" placeholder="URL">
                  <input [(ngModel)]="link.label" [name]="'link-label-'+i" placeholder="Label">
                  <button type="button" class="btn-icon btn-danger" (click)="proj.links.splice(i, 1)">×</button>
                </div>
              }
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-accent">{{ isNew() ? 'Create' : 'Update' }} Project</button>
              <button type="button" class="btn btn-ghost" (click)="closeEdit()">Cancel</button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .editor { max-width: 1000px; }

    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem; }
    .page-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .text-secondary { color: var(--text-secondary); font-size: 0.875rem; }

    .list-grid { display: flex; flex-direction: column; gap: 0.75rem; }

    .list-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.25rem;
      transition: border-color 0.2s;
      &:hover { border-color: var(--border-color); }
    }

    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .card-title-row { display: flex; align-items: center; gap: 0.5rem; }
    .card-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .card-desc { font-size: 0.8125rem; color: var(--text-secondary); margin: 0.5rem 0; line-height: 1.5; }

    .card-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.75rem; }

    .card-actions { display: flex; gap: 0.5rem; }

    .badge { padding: 0.125rem 0.5rem; border-radius: 6px; font-size: 0.6875rem; font-weight: 600; }
    .badge-accent { background: var(--accent-subtle); color: var(--accent); }

    .chip { padding: 0.2rem 0.625rem; border-radius: 6px; font-size: 0.75rem; background: var(--bg-tertiary); color: var(--text-secondary); }
    .chip-sm { padding: 0.125rem 0.5rem; font-size: 0.6875rem; }

    .empty-state { text-align: center; padding: 3rem; color: var(--text-tertiary); }

    .form-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.5rem;
    }

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

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding-top: 1rem;
    }

    .sub-section { margin-bottom: 1.5rem; }
    .sub-section h3 { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .sub-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }

    .inline-row {
      display: grid;
      grid-template-columns: 120px 1fr 140px auto;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: center;
    }

    .inline-row select, .inline-row input {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.8125rem;
      outline: none;
      &:focus { border-color: var(--accent); }
    }

    .btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
    .btn-accent { background: var(--accent); color: white; &:hover { opacity: 0.9; } }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-subtle); &:hover { background: var(--bg-tertiary); } }
    .btn-danger-ghost { background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-subtle); &:hover { color: var(--error); border-color: var(--error); } }

    .btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: var(--text-tertiary); &:hover { background: var(--bg-tertiary); color: var(--text-primary); } }
    .btn-danger { &:hover { color: var(--error); background: rgba(248,113,113,.1); } }

    .form-actions { display: flex; gap: 0.75rem; }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .inline-row { grid-template-columns: 1fr; }
    }
  `],
})
export class AdminProjectsEditorComponent {
  dataService = inject(AdminDataService);

  editing = signal<Project | null>(null);
  isNew = signal(false);

  openNew(): void {
    this.isNew.set(true);
    this.editing.set({
      id: crypto.randomUUID(),
      slug: '',
      title: '',
      category: '',
      description: '',
      role: '',
      techStack: [],
      highlights: [],
      links: [],
      images: [],
      featured: false,
    });
  }

  openEdit(project: Project): void {
    this.isNew.set(false);
    this.editing.set(JSON.parse(JSON.stringify(project)));
  }

  closeEdit(): void {
    this.editing.set(null);
    this.isNew.set(false);
  }

  addLink(proj: Project): void {
    proj.links.push({ type: 'live', url: '', label: '' });
  }

  splitComma(value: string): string[] {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }

  splitNewline(value: string): string[] {
    return value.split('\n').filter(Boolean);
  }

  onSave(): void {
    const proj = this.editing();
    if (!proj) return;

    if (this.isNew()) {
      this.dataService.addProject(proj);
    } else {
      this.dataService.updateProject(proj);
    }

    this.closeEdit();
  }

  onDelete(id: string): void {
    if (confirm('Delete this project? This cannot be undone.')) {
      this.dataService.deleteProject(id);
    }
  }
}
