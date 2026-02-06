import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill, SkillCategory } from '../../../core/models';

@Component({
  selector: 'app-skill-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skill-filters">
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
          {{ formatCategory(cat) }}
        </button>
      }
    </div>

    <div class="skill-grid grid grid-3">
      @for (skill of filteredSkills(); track skill.name; let i = $index) {
        <div class="skill-card card-flat animate-fade-in-up stagger-{{ (i % 6) + 1 }}">
          <div class="skill-header">
            <span class="skill-name text-h4">{{ skill.name }}</span>
            <span class="skill-category chip-outline">{{ formatCategory(skill.category) }}</span>
          </div>
          <div class="skill-level">
            <div class="level-track">
              <div class="level-fill" [style.width.%]="skill.level * 20"></div>
            </div>
            <span class="text-caption text-tertiary">{{ getLevelLabel(skill.level) }}</span>
          </div>
          @if (skill.tags && skill.tags.length > 0) {
            <div class="skill-tags">
              @for (tag of skill.tags; track tag) {
                <span class="chip">{{ tag }}</span>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .skill-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
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

    .skill-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .skill-level {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .level-track {
      height: 4px;
      border-radius: 2px;
      background: var(--bg-tertiary);
      overflow: hidden;
    }

    .level-fill {
      height: 100%;
      border-radius: 2px;
      background: var(--accent-gradient);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
  `],
})
export class SkillGridComponent {
  @Input({ required: true }) skills: Skill[] = [];

  activeCategory = signal<SkillCategory | 'all'>('all');

  categories = computed(() => {
    const cats = new Set(this.skills.map(s => s.category));
    return Array.from(cats);
  });

  filteredSkills = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.skills;
    return this.skills.filter(s => s.category === cat);
  });

  formatCategory(cat: string): string {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  getLevelLabel(level: number): string {
    const labels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level] || '';
  }
}
