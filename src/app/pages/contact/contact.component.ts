import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent],
  template: `
    @if (profileService.profile(); as profile) {
      <section class="section">
        <div class="container container-sm">
          <app-section-header
            label="Contact"
            title="Get in Touch"
            subtitle="Have a project in mind? Let's talk."
            [center]="true">
          </app-section-header>

          <div class="contact-grid">
            <!-- Contact Info -->
            <div class="contact-info">
              <div class="contact-card card-flat animate-fade-in-up stagger-1">
                <div class="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                  </svg>
                </div>
                <div>
                  <span class="text-caption text-tertiary">Email</span>
                  <a [href]="'mailto:' + profile.email" class="text-body-sm">{{ profile.email }}</a>
                </div>
              </div>

              @if (profile.phone) {
                <div class="contact-card card-flat animate-fade-in-up stagger-2">
                  <div class="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-caption text-tertiary">Phone</span>
                    <a [href]="'tel:' + profile.phone" class="text-body-sm">{{ profile.phone }}</a>
                  </div>
                </div>
              }

              <div class="contact-card card-flat animate-fade-in-up stagger-3">
                <div class="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                  </svg>
                </div>
                <div>
                  <span class="text-caption text-tertiary">Location</span>
                  <span class="text-body-sm">{{ profile.location }}</span>
                </div>
              </div>

              @for (social of profile.socials; track social.platform) {
                <a [href]="social.url" target="_blank" rel="noopener" class="contact-card card-flat animate-fade-in-up stagger-4">
                  <div class="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getSocialSvgPath(social.platform)"></svg>
                  </div>
                  <div>
                    <span class="text-caption text-tertiary">{{ social.platform | titlecase }}</span>
                    <span class="text-body-sm">{{ social.label || social.url }}</span>
                  </div>
                </a>
              }
            </div>

            <!-- Contact Form -->
            <div class="contact-form-wrapper animate-fade-in-up stagger-2">
              <form class="contact-form card-flat" (ngSubmit)="onSubmit()" #contactForm="ngForm">
                <div class="form-group">
                  <label for="name" class="text-body-sm">Name</label>
                  <input
                    id="name"
                    type="text"
                    class="form-input"
                    [(ngModel)]="form.name"
                    name="name"
                    required
                    placeholder="Your name" />
                </div>

                <div class="form-group">
                  <label for="email" class="text-body-sm">Email</label>
                  <input
                    id="email"
                    type="email"
                    class="form-input"
                    [(ngModel)]="form.email"
                    name="email"
                    required
                    placeholder="you@example.com" />
                </div>

                <div class="form-group">
                  <label for="message" class="text-body-sm">Message</label>
                  <textarea
                    id="message"
                    class="form-input form-textarea"
                    [(ngModel)]="form.message"
                    name="message"
                    required
                    rows="5"
                    placeholder="Tell me about your project..."></textarea>
                </div>

                <!-- Honeypot (spam protection) -->
                <div style="position: absolute; left: -9999px;">
                  <input type="text" [(ngModel)]="form.honeypot" name="website" tabindex="-1" autocomplete="off" />
                </div>

                <button
                  type="submit"
                  class="btn-primary submit-btn"
                  [disabled]="submitted()">
                  @if (submitted()) {
                    ✓ Message Sent
                  } @else {
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                    </svg>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 2rem;
      align-items: start;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .contact-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: inherit;

      &:hover {
        border-color: var(--border-color);
      }
    }

    .contact-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      color: var(--accent);

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .contact-card div {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group label {
      font-weight: 500;
    }

    .form-input {
      padding: 0.625rem 0.875rem;
      border-radius: 10px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-tertiary);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 0.875rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: var(--accent);
      }

      &::placeholder {
        color: var(--text-tertiary);
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      position: relative;
    }

    .submit-btn {
      align-self: flex-start;
      width: 100%;
      justify-content: center;

      &:disabled {
        opacity: 0.7;
        cursor: default;
        background: var(--success);
      }
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ContactComponent {
  profileService = inject(ProfileService);

  form = {
    name: '',
    email: '',
    message: '',
    honeypot: '', // spam protection
  };

  submitted = signal(false);

  onSubmit(): void {
    // Honeypot check
    if (this.form.honeypot) return;

    if (!this.form.name || !this.form.email || !this.form.message) return;

    // In frontend-only mode, open mailto
    const subject = encodeURIComponent(`Portfolio Contact from ${this.form.name}`);
    const body = encodeURIComponent(
      `Name: ${this.form.name}\nEmail: ${this.form.email}\n\n${this.form.message}`
    );
    const email = this.profileService.profile()?.email || '';
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

    this.submitted.set(true);
    setTimeout(() => this.submitted.set(false), 3000);
  }

  getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      linkedin: 'in', github: 'gh', twitter: 'tw', email: '@',
      whatsapp: 'wa', website: 'web',
    };
    return icons[platform] || 'link';
  }

  getSocialSvgPath(platform: string): string {
    const paths: Record<string, string> = {
      linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
      github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>',
      twitter: '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>',
      email: '<path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>',
      whatsapp: '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
      website: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
      dribbble: '<circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>',
      youtube: '<path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
      medium: '<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>',
      stackoverflow: '<path d="M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.62 9.335 1.994-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.755.879.177-1.92zm.538-2.587l-9.276-2.608-.526 1.954 9.306 2.5.496-1.846zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 4.195v8h-12v-8h-2v10h16v-10h-2z"/>'
    };
    return paths[platform] || '<path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>';
  }
}
