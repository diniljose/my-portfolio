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
    <!-- Skip Link for Accessibility -->
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <!-- Modern Navigation -->
    <nav class="nav" [class.scrolled]="isScrolled()" [class.hidden]="navHidden() && !mobileMenuOpen()">
      <div class="nav-inner container">
        <!-- Logo -->
        <a [routerLink]="['/']" class="nav-logo group">
          <div class="logo-icon">
            <span class="logo-letter">{{ initials() }}</span>
            <div class="logo-glow"></div>
          </div>
          <span class="logo-name">{{ profileName() }}</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="nav-links" [class.open]="mobileMenuOpen()">
          <div class="nav-links-inner">
            @for (link of navLinks; track link.path; let i = $index) {
              <a
                [routerLink]="[link.path]"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: link.path === '' }"
                class="nav-link"
                [style.animation-delay]="mobileMenuOpen() ? (i * 0.05) + 's' : '0s'"
                (click)="mobileMenuOpen.set(false)">
                <span class="link-text">{{ link.label }}</span>
                <span class="link-indicator"></span>
              </a>
            }
          </div>

          <!-- Mobile CTA -->
          <div class="mobile-cta">
            <a [routerLink]="['contact']" class="btn-mobile-cta" (click)="mobileMenuOpen.set(false)">
              Let's Connect
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Navigation Actions -->
        <div class="nav-actions">
          <button class="search-btn" (click)="openSearch()" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span class="search-shortcut">⌘K</span>
          </button>
          
          <app-theme-switch />
          
          <button
            class="mobile-toggle"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            [class.active]="mobileMenuOpen()"
            aria-label="Toggle menu">
            <span class="hamburger">
              <span class="line"></span>
              <span class="line"></span>
              <span class="line"></span>
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Backdrop -->
      @if (mobileMenuOpen()) {
        <div class="mobile-backdrop" (click)="mobileMenuOpen.set(false)"></div>
      }
    </nav>

    <!-- Main Content -->
    <main id="main-content" class="main-content">
      <router-outlet />
    </main>

    <!-- Modern Footer -->
    <footer class="footer no-print">
      <div class="container">
        <!-- Footer Top -->
        <div class="footer-top">
          <div class="footer-brand">
            <a [routerLink]="['/']" class="footer-logo">
              <div class="logo-icon-sm">{{ initials() }}</div>
              <span class="footer-name">{{ profileName() }}</span>
            </a>
            <p class="footer-tagline">Building digital experiences with precision and passion.</p>
          </div>

          <div class="footer-links-grid">
            <div class="footer-col">
              <h4 class="footer-heading">Navigation</h4>
              <div class="footer-nav">
                @for (link of navLinks | slice:0:4; track link.path) {
                  <a [routerLink]="[link.path]" class="footer-link">{{ link.label }}</a>
                }
              </div>
            </div>
            <div class="footer-col">
              <h4 class="footer-heading">More</h4>
              <div class="footer-nav">
                @for (link of navLinks | slice:4; track link.path) {
                  <a [routerLink]="[link.path]" class="footer-link">{{ link.label }}</a>
                }
              </div>
            </div>
            <div class="footer-col">
              <h4 class="footer-heading">Connect</h4>
              <div class="footer-socials">
                @if (profileService.profile(); as profile) {
                  @for (social of profile.socials; track social.platform) {
                    <a [href]="social.url" target="_blank" rel="noopener" class="footer-social" [attr.aria-label]="social.platform">
                      <svg class="footer-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getSocialSvgPath(social.platform)"></svg>
                    </a>
                  }
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <p class="copyright">
            &copy; {{ currentYear }} {{ profileName() }}. Crafted with 
            <span class="heart" aria-label="love">♥</span> using Angular.
          </p>
          <div class="footer-meta">
            <span class="status-indicator">
              <span class="status-dot"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Decoration -->
      <div class="footer-decoration" aria-hidden="true">
        <div class="decoration-gradient"></div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }

    /* ═══ NAVIGATION ═══ */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 0.75rem 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: transparent;

      &.scrolled {
        background: var(--bg-glass);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-bottom: 1px solid var(--border-subtle);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
      }

      &.hidden {
        transform: translateY(-100%);
      }
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    /* Logo */
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
    }

    .logo-icon {
      position: relative;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-gradient);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .nav-logo:hover .logo-icon {
      transform: rotate(-5deg) scale(1.05);
    }

    .logo-letter {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      position: relative;
      z-index: 1;
    }

    .logo-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent);
    }

    .logo-name {
      font-size: 1.125rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      display: none;
    }

    @media (min-width: 1024px) {
      .logo-name { display: block; }
    }

    /* Nav Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-links-inner {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-link {
      position: relative;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      overflow: hidden;

      &:hover {
        color: var(--text-primary);
        background: var(--accent-subtle);
      }

      &.active {
        color: var(--accent);
      }

      &.active .link-indicator {
        transform: scaleX(1);
      }
    }

    .link-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 20px;
      height: 2px;
      background: var(--accent-gradient);
      border-radius: 1px;
      transition: transform 0.3s ease;
    }

    /* Nav Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      border-radius: 10px;
      color: var(--text-tertiary);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        border-color: var(--border-color);
        color: var(--text-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
    }

    .search-shortcut {
      font-size: 0.6875rem;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      background: var(--bg-tertiary);
      font-family: inherit;
    }

    /* Mobile Toggle */
    .mobile-toggle {
      display: none;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 18px;
    }

    .hamburger .line {
      height: 2px;
      background: var(--text-primary);
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .mobile-toggle.active .line:nth-child(1) {
      transform: rotate(45deg) translate(4px, 4px);
    }

    .mobile-toggle.active .line:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .mobile-toggle.active .line:nth-child(3) {
      transform: rotate(-45deg) translate(4px, -4px);
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: -1;
      animation: fadeIn 0.3s ease;
    }

    .mobile-cta {
      display: none;
    }

    /* Main Content */
    .main-content {
      min-height: 100vh;
      padding-top: 4rem;
    }

    /* ═══ FOOTER ═══ */
    .footer {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      padding: 4rem 0 2rem;
      overflow: hidden;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    @media (min-width: 768px) {
      .footer-top {
        grid-template-columns: 1.5fr 2fr;
      }
    }

    .footer-brand {
      max-width: 300px;
    }

    .footer-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      margin-bottom: 1rem;
    }

    .logo-icon-sm {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-gradient);
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 700;
      color: #fff;
    }

    .footer-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .footer-tagline {
      font-size: 0.9375rem;
      color: var(--text-tertiary);
      line-height: 1.6;
    }

    .footer-links-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .footer-heading {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-tertiary);
      margin-bottom: 1rem;
    }

    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-link {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
      padding: 0.25rem 0;

      &:hover {
        color: var(--accent);
        transform: translateX(4px);
      }
    }

    .footer-socials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .footer-social {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.3s ease;
      color: var(--text-secondary);

      &:hover {
        background: var(--accent-subtle);
        border-color: var(--accent);
        transform: translateY(-3px);
        color: var(--accent);
      }
    }

    .footer-social-icon {
      width: 18px;
      height: 18px;
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-subtle);
    }

    .copyright {
      font-size: 0.875rem;
      color: var(--text-tertiary);
    }

    .heart {
      display: inline-block;
      animation: heartbeat 1.5s ease-in-out infinite;
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .footer-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .footer-decoration {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      pointer-events: none;
      overflow: hidden;
    }

    .decoration-gradient {
      position: absolute;
      bottom: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 400px;
      background: radial-gradient(ellipse, rgba(var(--accent-rgb), 0.05) 0%, transparent 70%);
    }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 768px) {
      .nav-links {
        display: none;
        position: fixed;
        top: 4rem;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--bg-primary);
        flex-direction: column;
        padding: 2rem;
        gap: 1rem;
        z-index: 99;
        overflow-y: auto;

        &.open {
          display: flex;
        }
      }

      .nav-links-inner {
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
      }

      .nav-link {
        font-size: 1.25rem;
        padding: 1rem;
        width: 100%;
        text-align: center;
        animation: slideInRight 0.4s ease forwards;
        opacity: 0;
      }

      .mobile-toggle {
        display: flex;
      }

      .search-shortcut {
        display: none;
      }

      .mobile-cta {
        display: block;
        margin-top: auto;
        padding-top: 2rem;
        width: 100%;
      }

      .btn-mobile-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        padding: 1rem;
        background: var(--accent-gradient);
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 12px;
        text-decoration: none;
      }

      .footer-links-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .footer-links-grid {
        grid-template-columns: 1fr;
      }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class PortfolioLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  profileService = inject(ProfileService);
  private themeService = inject(ThemeService);
  private searchService = inject(SearchService);

  slug = signal('');
  isScrolled = signal(false);
  navHidden = signal(false);
  mobileMenuOpen = signal(false);
  currentYear = new Date().getFullYear();
  private lastScrollY = 0;

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

  toggleMobileMenu(): void {
    const nextState = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(nextState);
    if (nextState) {
      this.navHidden.set(false);
    }
  }

  getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      linkedin: 'in',
      github: 'gh',
      twitter: 'tw',
      email: '@',
      whatsapp: 'wa',
      website: 'web',
    };
    return icons[platform] || '◆';
  }

  getSocialSvgPath(platform: string): string {
    const paths: Record<string, string> = {
      linkedin: '<circle cx="4" cy="4" r="2" transform="translate(2 2)"/><path d="M4 10v10"/><path d="M12 16v4"/><path d="M12 12c0-2 1.5-4 4-4s4 2 4 4v8"/>',
      github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
      twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
      email: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
      whatsapp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
      website: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    };
    return paths[platform] || '<circle cx="12" cy="12" r="10"/>';
  }

  ngOnInit(): void {
    // Load default profile
    this.profileService.loadProfile('dinil');

    // Apply profile theme override
    this.profileService.profile;

    // Scroll listener with hide/show nav
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        this.isScrolled.set(currentScrollY > 20);
        
        // Hide nav on scroll down, show on scroll up
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
          this.navHidden.set(true);
        } else {
          this.navHidden.set(false);
        }
        this.lastScrollY = currentScrollY;
      });
    }
  }
}
