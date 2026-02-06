import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { Skill, SkillCategory } from '../../../core/models';

const CATEGORIES: SkillCategory[] = ['frontend', 'backend', 'devops', 'database', 'testing', 'tools', 'design', 'cloud', 'other'];

@Component({
  selector: 'app-admin-skills-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor">
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>Skills</h1>
            <p class="text-secondary">Manage your skills and expertise levels</p>
          </div>
          <button class="btn btn-accent" (click)="openNew()">+ New Skill</button>
        </div>
      </div>

      <!-- Filter by Category -->
      <div class="filter-bar">
        <button
          class="filter-chip"
          [class.active]="selectedCategory() === null"
          (click)="selectedCategory.set(null)">
          All ({{ dataService.skills().length }})
        </button>
        @for (cat of categories; track cat) {
          <button
            class="filter-chip"
            [class.active]="selectedCategory() === cat"
            (click)="selectedCategory.set(cat)">
            {{ cat }} ({{ countByCategory(cat) }})
          </button>
        }
      </div>

      <!-- Skills Grid -->
      @if (!editing()) {
        <div class="skills-grid">
          @for (skill of filteredSkills(); track skill.name) {
            <div class="skill-card">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">
                  @for (i of [1,2,3,4,5]; track i) {
                    <span class="dot" [class.filled]="i <= skill.level"></span>
                  }
                </span>
              </div>
              <div class="skill-meta">
                <span class="chip">{{ skill.category }}</span>
                @if (skill.tags) {
                  @for (tag of skill.tags.slice(0, 2); track tag) {
                    <span class="chip chip-sm">{{ tag }}</span>
                  }
                }
              </div>
              <div class="card-actions">
                <button class="btn btn-xs btn-ghost" (click)="openEdit(skill)">Edit</button>
                <button class="btn btn-xs btn-danger-ghost" (click)="onDelete(skill.name)">Delete</button>
              </div>
            </div>
          }
          @empty {
            <div class="empty-state">
              <p>No skills found.</p>
            </div>
          }
        </div>
      }

      <!-- Edit Form -->
      @if (editing(); as skill) {
        <div class="form-card">
          <div class="form-card-header">
            <h2>{{ isNew() ? 'New Skill' : 'Edit Skill' }}</h2>
            <button class="btn-icon" (click)="closeEdit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <form (ngSubmit)="onSave()" class="editor-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Skill Name *</label>
                <input type="text" [(ngModel)]="skill.name" name="name" required>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="skill.category" name="category">
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Proficiency Level (1–5)</label>
                <div class="level-selector">
                  @for (i of [1,2,3,4,5]; track i) {
                    <button
                      type="button"
                      class="level-btn"
                      [class.active]="skill.level >= i"
                      (click)="setLevel(skill, i)">
                      {{ i }}
                    </button>
                  }
                </div>
              </div>
              <div class="form-group">
                <label>Icon (optional)</label>
                <input type="text" [(ngModel)]="skill.icon" name="icon" placeholder="e.g. angular, react">
              </div>
              <div class="form-group full-width">
                <label>Tags (comma-separated)</label>
                <input type="text" [ngModel]="(skill.tags || []).join(', ')" (ngModelChange)="skill.tags = splitComma($event)" name="tags" placeholder="e.g. TypeScript, SPA, Reactive">
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-accent">{{ isNew() ? 'Add' : 'Update' }} Skill</button>
              <button type="button" class="btn btn-ghost" (click)="closeEdit()">Cancel</button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .editor { max-width: 1000px; }

    .page-header { margin-bottom: 1rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem; }
    .page-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .text-secondary { color: var(--text-secondary); font-size: 0.875rem; }

    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-bottom: 1.5rem;
    }

    .filter-chip {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      text-transform: capitalize;

      &:hover { border-color: var(--border-color); }
      &.active { background: var(--accent-subtle); color: var(--accent); border-color: var(--accent); }
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 0.75rem;
    }

    .skill-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 1rem;
      transition: border-color 0.2s;
      &:hover { border-color: var(--border-color); }
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .skill-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .skill-level {
      display: flex;
      gap: 3px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--bg-tertiary);

      &.filled { background: var(--accent); }
    }

    .skill-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-bottom: 0.75rem;
    }

    .chip { padding: 0.2rem 0.625rem; border-radius: 6px; font-size: 0.75rem; background: var(--bg-tertiary); color: var(--text-secondary); text-transform: capitalize; }
    .chip-sm { padding: 0.125rem 0.5rem; font-size: 0.6875rem; }

    .card-actions { display: flex; gap: 0.5rem; }

    .empty-state { text-align: center; padding: 2rem; color: var(--text-tertiary); grid-column: 1 / -1; }

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

    .level-selector {
      display: flex;
      gap: 0.375rem;
    }

    .level-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-primary);
      color: var(--text-tertiary);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &.active { background: var(--accent); color: white; border-color: var(--accent); }
      &:hover:not(.active) { border-color: var(--border-color); }
    }

    .btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-xs { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
    .btn-accent { background: var(--accent); color: white; &:hover { opacity: 0.9; } }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-subtle); &:hover { background: var(--bg-tertiary); } }
    .btn-danger-ghost { background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-subtle); &:hover { color: var(--error); border-color: var(--error); } }
    .btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: var(--text-tertiary); &:hover { background: var(--bg-tertiary); color: var(--text-primary); } }
    .form-actions { display: flex; gap: 0.75rem; }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .skills-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class AdminSkillsEditorComponent {
  dataService = inject(AdminDataService);
  categories = CATEGORIES;

  selectedCategory = signal<SkillCategory | null>(null);
  editing = signal<Skill | null>(null);
  isNew = signal(false);
  private originalName = '';

  filteredSkills = computed(() => {
    const cat = this.selectedCategory();
    const skills = this.dataService.skills();
    return cat ? skills.filter(s => s.category === cat) : skills;
  });

  countByCategory(cat: SkillCategory): number {
    return this.dataService.skills().filter(s => s.category === cat).length;
  }

  openNew(): void {
    this.isNew.set(true);
    this.editing.set({
      name: '',
      category: 'frontend',
      level: 3,
      tags: [],
    });
    this.originalName = '';
  }

  openEdit(skill: Skill): void {
    this.isNew.set(false);
    this.originalName = skill.name;
    this.editing.set(JSON.parse(JSON.stringify(skill)));
  }

  closeEdit(): void {
    this.editing.set(null);
    this.isNew.set(false);
  }

  setLevel(skill: Skill, level: number): void {
    skill.level = level as Skill['level'];
  }

  splitComma(value: string): string[] {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }

  onSave(): void {
    const skill = this.editing();
    if (!skill) return;

    if (this.isNew()) {
      this.dataService.addSkill(skill);
    } else {
      this.dataService.updateSkill(this.originalName, skill);
    }

    this.closeEdit();
  }

  onDelete(name: string): void {
    if (confirm(`Delete skill "${name}"?`)) {
      this.dataService.deleteSkill(name);
    }
  }
}
