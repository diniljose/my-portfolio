import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ProfileService, ThemeService, SearchService } from '../core/services';
import { ThemeSwitchComponent } from '../shared/components/theme-switch/theme-switch.component';

@Component({
  selector: 'app-portfolio-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ThemeSwitchComponent],
  template: `
    <!-- Navigation -->
    <nav class="nav no-print" [class.scrolled]="isScrolled()">
      <div class="nav-inner container">
        <a [routerLink]="['/p', slug()]" class="nav-logo">
          <span class="logo-text">{{ initials() }}</span>
        </a>

        <div class="nav-links" [class.open]="mobileMenuOpen()">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="['/p', slug(), link.path]"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: link.path === '' }"
              class="nav-link"
              (click)="mobileMenuOpen.set(false)">
              {{ link.label }}
            </a>
          }
        </div>

        <div class="nav-actions">
          <button class="btn-ghost search-trigger" (click)="openSearch()" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span class="search-shortcut">⌘K</span>
          </button>
          <app-theme-switch />
          <button
            class="mobile-toggle btn-icon"
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @if (mobileMenuOpen()) {
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              } @else {
                <path d="M4 8h16"/><path d="M4 16h16"/>
              }
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main id="main-content" class="main-content">
      <router-outlet />
    </main>

    <!-- Footer -->
    <footer class="footer no-print">
      <div class="container">
        <div class="footer-inner">
          <p class="text-body-sm text-tertiary">
            &copy; {{ currentYear }} {{ profileName() }}. Built with Angular.
          </p>
          <div class="footer-links">
            @for (link of navLinks; track link.path) {
              <a [routerLink]="['/p', slug(), link.path]" class="footer-link text-caption text-tertiary">
                {{ link.label }}
              </a>
            }
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }

    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 0.75rem 0;
      transition: all 0.3s ease;
      background: transparent;

      &.scrolled {
        background: var(--bg-glass);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid var(--border-subtle);
      }
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--text-primary);
    }

    .logo-text {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-link {
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 450;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      text-decoration: none;

      &:hover {
        color: var(--text-primary);
        background: var(--accent-subtle);
      }

      &.active {
        color: var(--accent);
        background: var(--accent-subtle);
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .search-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      border-radius: 8px;
      color: var(--text-tertiary);
      border: 1px solid var(--border-subtle);
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--border-color);
        color: var(--text-secondary);
      }
    }

    .search-shortcut {
      font-size: 0.6875rem;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      background: var(--bg-tertiary);
      font-family: inherit;
    }

    .mobile-toggle {
      display: none;
    }

    .main-content {
      min-height: 100vh;
      padding-top: 4rem;
    }

    .footer {
      border-top: 1px solid var(--border-subtle);
      padding: 2rem 0;
    }

    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-link {
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: var(--text-primary); }
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
        position: fixed;
        top: 3.5rem;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--bg-primary);
        flex-direction: column;
        padding: 2rem;
        gap: 0.5rem;
        z-index: 99;

        &.open {
          display: flex;
        }
      }

      .nav-link {
        font-size: 1.125rem;
        padding: 0.75rem 1rem;
        width: 100%;
      }

      .mobile-toggle {
        display: flex;
      }

      .search-shortcut {
        display: none;
      }

      .footer-inner {
        flex-direction: column;
        text-align: center;
      }
    }
  `],
})
export class PortfolioLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private themeService = inject(ThemeService);
  private searchService = inject(SearchService);

  slug = signal('');
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  currentYear = new Date().getFullYear();

  initials = computed(() => {
    const p = this.profileService.profile();
    if (!p) return '◆';
    return (p.firstName[0] + p.lastName[0]).toUpperCase();
  });

  profileName = computed(() => {
    const p = this.profileService.profile();
    return p ? `${p.firstName} ${p.lastName}` : 'Portfolio';
  });

  navLinks = [
    { path: '', label: 'Home' },
    { path: 'about', label: 'About' },
    { path: 'projects', label: 'Projects' },
    { path: 'experience', label: 'Experience' },
    { path: 'skills', label: 'Skills' },
    { path: 'resume', label: 'Resume' },
    { path: 'contact', label: 'Contact' },
  ];

  openSearch(): void {
    this.searchService.open();
  }

  ngOnInit(): void {
    // Listen for route params
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || 'dinil';
      this.slug.set(slug);
      this.profileService.loadProfile(slug);
    });

    // Apply profile theme override
    this.profileService.profile;

    // Scroll listener
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 20);
      });
    }
  }
}
