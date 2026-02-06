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
                <div class="contact-icon">✉️</div>
                <div>
                  <span class="text-caption text-tertiary">Email</span>
                  <a [href]="'mailto:' + profile.email" class="text-body-sm">{{ profile.email }}</a>
                </div>
              </div>

              @if (profile.phone) {
                <div class="contact-card card-flat animate-fade-in-up stagger-2">
                  <div class="contact-icon">📱</div>
                  <div>
                    <span class="text-caption text-tertiary">Phone</span>
                    <a [href]="'tel:' + profile.phone" class="text-body-sm">{{ profile.phone }}</a>
                  </div>
                </div>
              }

              <div class="contact-card card-flat animate-fade-in-up stagger-3">
                <div class="contact-icon">📍</div>
                <div>
                  <span class="text-caption text-tertiary">Location</span>
                  <span class="text-body-sm">{{ profile.location }}</span>
                </div>
              </div>

              @for (social of profile.socials; track social.platform) {
                <a [href]="social.url" target="_blank" rel="noopener" class="contact-card card-flat animate-fade-in-up stagger-4">
                  <div class="contact-icon">{{ getSocialIcon(social.platform) }}</div>
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
      font-size: 1.5rem;
      flex-shrink: 0;
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
      linkedin: '🔗', github: '💻', twitter: '🐦', email: '✉️',
      whatsapp: '💬', website: '🌐',
    };
    return icons[platform] || '🔗';
  }
}
