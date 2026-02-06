import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminDataService } from '../services/admin-data.service';
import { ThemeSwitchComponent } from '../../shared/components/theme-switch/theme-switch.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ThemeSwitchComponent],
  template: `
    <div class="admin-shell">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            @if (!sidebarCollapsed()) {
              <span class="logo-text">Folio Admin</span>
            }
          </div>
          <button class="btn-icon collapse-btn" (click)="sidebarCollapsed.set(!sidebarCollapsed())">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @if (sidebarCollapsed()) {
                <path d="M9 18l6-6-6-6"/>
              } @else {
                <path d="M15 18l-6-6 6-6"/>
              }
            </svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of navItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.route === '/admin' }"
              class="nav-item"
              [title]="item.label">
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">{{ item.label }}</span>
              }
              @if (!sidebarCollapsed() && item.badge) {
                <span class="nav-badge">{{ item.badge() }}</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          @if (!sidebarCollapsed()) {
            <div class="user-info">
              <div class="user-avatar">{{ userInitial() }}</div>
              <div class="user-details">
                <span class="user-name">{{ auth.user()?.displayName }}</span>
                <span class="user-role">{{ auth.user()?.role }}</span>
              </div>
            </div>
          }
          <button class="btn-icon logout-btn" (click)="onLogout()" title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="admin-main">
        <!-- Top Bar -->
        <header class="topbar">
          <div class="topbar-left">
            <app-theme-switch />
          </div>
          <div class="topbar-right">
            @if (dataService.dirty()) {
              <span class="unsaved-badge">Unsaved changes</span>
            }
            <button class="btn btn-sm btn-accent" (click)="onSave()" [disabled]="!dataService.dirty()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save
            </button>
            <a [routerLink]="['/p', dataService.currentSlug()]" class="btn btn-sm btn-ghost" target="_blank">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View Site
            </a>
          </div>
        </header>

        <!-- Content -->
        <div class="admin-content">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }

    .admin-shell {
      display: flex;
      height: 100%;
      background: var(--bg-primary);
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 260px;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      transition: width 0.25s ease;
      flex-shrink: 0;

      &.collapsed {
        width: 64px;
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--accent);
    }

    .logo-text {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-tertiary);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 0.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 10px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.8125rem;
      font-weight: 450;
      transition: all 0.15s;
      white-space: nowrap;

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      &.active {
        background: var(--accent-subtle);
        color: var(--accent);
      }
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }

    .nav-badge {
      margin-left: auto;
      padding: 0.125rem 0.5rem;
      border-radius: 10px;
      font-size: 0.6875rem;
      font-weight: 600;
      background: var(--accent-subtle);
      color: var(--accent);
    }

    .sidebar-footer {
      padding: 0.75rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.625rem;
      min-width: 0;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--accent-subtle);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-name {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.6875rem;
      color: var(--text-tertiary);
      text-transform: capitalize;
    }

    .logout-btn {
      flex-shrink: 0;
      color: var(--text-tertiary);
      &:hover { color: var(--error); background: rgba(248, 113, 113, 0.1); }
    }

    /* ── Main ── */
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-secondary);
      flex-shrink: 0;
    }

    .topbar-left, .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .unsaved-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 10px;
      background: rgba(251, 191, 36, 0.12);
      color: var(--warning);
      font-weight: 500;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      border: none;
      cursor: pointer;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }

    .btn-accent {
      background: var(--accent);
      color: white;
      &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      &:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    }

    .admin-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        z-index: 1000;
        height: 100%;
        &.collapsed { width: 0; overflow: hidden; }
      }
    }
  `],
})
export class AdminLayoutComponent implements OnInit {
  auth = inject(AdminAuthService);
  dataService = inject(AdminDataService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);

  userInitial = computed(() => {
    const name = this.auth.user()?.displayName || '';
    return name.charAt(0).toUpperCase();
  });

  navItems = [
    {
      route: '/admin',
      label: 'Dashboard',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
      badge: null as (() => number) | null,
    },
    {
      route: '/admin/profile',
      label: 'Profile',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      badge: null as (() => number) | null,
    },
    {
      route: '/admin/projects',
      label: 'Projects',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
      badge: () => this.dataService.projects().length,
    },
    {
      route: '/admin/experience',
      label: 'Experience',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      badge: () => this.dataService.experience().length,
    },
    {
      route: '/admin/skills',
      label: 'Skills',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      badge: () => this.dataService.skills().length,
    },
    {
      route: '/admin/education',
      label: 'Education & Certs',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"/></svg>',
      badge: null as (() => number) | null,
    },
  ];

  ngOnInit(): void {
    // Load default profile data for admin
    this.dataService.loadData('dinil');
  }

  onSave(): void {
    this.dataService.save();
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
