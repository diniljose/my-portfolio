import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p class="text-secondary">Overview of your portfolio data</p>
      </div>

      @if (dataService.loading()) {
        <div class="loading">Loading data...</div>
      } @else {
        @if (stats(); as s) {
          <!-- Stats Grid -->
          <div class="stats-grid">
            @for (stat of statCards(s); track stat.label) {
              <a [routerLink]="stat.route" class="stat-card">
                <div class="stat-icon" [innerHTML]="stat.icon"></div>
                <div class="stat-info">
                  <span class="stat-value">{{ stat.value }}</span>
                  <span class="stat-label">{{ stat.label }}</span>
                </div>
              </a>
            }
          </div>

          <!-- Quick Actions -->
          <div class="section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="actions-grid">
              <button class="action-card" (click)="onExport()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Export JSON</span>
              </button>
              <label class="action-card">
                <input type="file" accept=".json" (change)="onImport($event)" hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Import JSON</span>
              </label>
              <button class="action-card action-danger" (click)="onReset()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                <span>Reset to Original</span>
              </button>
            </div>
          </div>

          <!-- Recent Projects -->
          <div class="section">
            <div class="section-header-row">
              <h2 class="section-title">Projects</h2>
              <a routerLink="/admin/projects" class="link-sm">View all →</a>
            </div>
            <div class="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Featured</th>
                    <th>Tech Stack</th>
                  </tr>
                </thead>
                <tbody>
                  @for (project of dataService.projects().slice(0, 5); track project.id) {
                    <tr>
                      <td class="td-primary">{{ project.title }}</td>
                      <td><span class="chip">{{ project.category }}</span></td>
                      <td>
                        @if (project.featured) {
                          <span class="badge badge-success">★ Featured</span>
                        } @else {
                          <span class="badge badge-muted">—</span>
                        }
                      </td>
                      <td>
                        <div class="tech-tags">
                          @for (tech of project.techStack.slice(0, 3); track tech) {
                            <span class="chip chip-sm">{{ tech }}</span>
                          }
                          @if (project.techStack.length > 3) {
                            <span class="chip chip-sm">+{{ project.techStack.length - 3 }}</span>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Skills Breakdown -->
          <div class="section">
            <div class="section-header-row">
              <h2 class="section-title">Skills Breakdown</h2>
              <a routerLink="/admin/skills" class="link-sm">Manage →</a>
            </div>
            <div class="skills-breakdown">
              @for (cat of skillCategories(); track cat.name) {
                <div class="category-bar">
                  <div class="cat-label">
                    <span class="cat-name">{{ cat.name }}</span>
                    <span class="cat-count">{{ cat.count }}</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill" [style.width.%]="cat.pct"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.25rem;
    }

    .text-secondary { color: var(--text-secondary); font-size: 0.875rem; }

    .loading {
      text-align: center;
      padding: 3rem;
      color: var(--text-tertiary);
    }

    /* ── Stats Grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.2s;

      &:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--accent-subtle);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* ── Section ── */
    .section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem;
    }

    .section-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .section-header-row .section-title {
      margin: 0;
    }

    .link-sm {
      font-size: 0.8125rem;
      color: var(--accent);
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    /* ── Actions ── */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.75rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border-color: var(--border-color);
      }

      &.action-danger:hover {
        border-color: var(--error);
        color: var(--error);
      }
    }

    /* ── Table ── */
    .table-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-tertiary);
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-subtle);
    }

    td {
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border-subtle);
    }

    tr:last-child td { border-bottom: none; }

    .td-primary {
      color: var(--text-primary);
      font-weight: 500;
    }

    .chip {
      display: inline-block;
      padding: 0.2rem 0.625rem;
      border-radius: 6px;
      font-size: 0.75rem;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }

    .chip-sm {
      padding: 0.125rem 0.5rem;
      font-size: 0.6875rem;
    }

    .badge {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      border-radius: 6px;
      font-size: 0.6875rem;
      font-weight: 600;
    }

    .badge-success { background: rgba(52, 211, 153, 0.12); color: var(--success); }
    .badge-muted { background: var(--bg-tertiary); color: var(--text-tertiary); }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    /* ── Skills Breakdown ── */
    .skills-breakdown {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .category-bar {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .cat-label {
      display: flex;
      justify-content: space-between;
    }

    .cat-name {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-primary);
      text-transform: capitalize;
    }

    .cat-count {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .bar-track {
      height: 6px;
      border-radius: 3px;
      background: var(--bg-tertiary);
    }

    .bar-fill {
      height: 100%;
      border-radius: 3px;
      background: var(--accent);
      transition: width 0.4s ease;
    }
  `],
})
export class AdminDashboardComponent {
  dataService = inject(AdminDataService);

  stats = computed(() => this.dataService.stats());

  skillCategories = computed(() => {
    const skills = this.dataService.skills();
    const catMap = new Map<string, number>();
    skills.forEach(s => catMap.set(s.category, (catMap.get(s.category) || 0) + 1));
    const max = Math.max(...catMap.values(), 1);
    return Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count, pct: (count / max) * 100 }))
      .sort((a, b) => b.count - a.count);
  });

  statCards(s: NonNullable<ReturnType<typeof this.stats>>) {
    return [
      { label: 'Projects', value: s.projects, route: '/admin/projects', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
      { label: 'Skills', value: s.skills, route: '/admin/skills', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
      { label: 'Experience', value: s.experience, route: '/admin/experience', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
      { label: 'Featured', value: s.featuredProjects, route: '/admin/projects', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
      { label: 'Education', value: s.education, route: '/admin/education', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"/></svg>' },
      { label: 'Certifications', value: s.certifications, route: '/admin/education', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' },
    ];
  }

  onExport(): void {
    this.dataService.exportJson();
  }

  async onImport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const ok = await this.dataService.importJson(file);
    if (!ok) {
      alert('Invalid JSON file. Ensure it matches the portfolio data format.');
    }
    input.value = '';
  }

  onReset(): void {
    if (confirm('Reset all changes to the original data? This cannot be undone.')) {
      this.dataService.resetToOriginal();
    }
  }
}
