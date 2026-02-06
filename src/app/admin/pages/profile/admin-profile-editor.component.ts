import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { Profile, SocialLink } from '../../../core/models';

@Component({
  selector: 'app-admin-profile-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor">
      <div class="page-header">
        <h1>Profile Editor</h1>
        <p class="text-secondary">Edit personal information, bio, and social links</p>
      </div>

      @if (dataService.loading()) {
        <div class="loading">Loading...</div>
      } @else if (form()) {
        <form (ngSubmit)="onSave()" class="editor-form">
          <!-- Personal Info -->
          <div class="form-section">
            <h2 class="form-section-title">Personal Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" [(ngModel)]="form()!.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" [(ngModel)]="form()!.lastName" name="lastName" required>
              </div>
              <div class="form-group full-width">
                <label>Headline</label>
                <input type="text" [(ngModel)]="form()!.headline" name="headline" placeholder="e.g. Senior Software Engineer">
              </div>
              <div class="form-group full-width">
                <label>Summary</label>
                <textarea [(ngModel)]="form()!.summary" name="summary" rows="4" placeholder="Brief professional summary..."></textarea>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="form()!.email" name="email" required>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" [(ngModel)]="form()!.phone" name="phone">
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="form()!.location" name="location">
              </div>
              <div class="form-group">
                <label>Availability</label>
                <select [(ngModel)]="form()!.availability" name="availability">
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="not-available">Not Available</option>
                </select>
              </div>
              <div class="form-group">
                <label>Avatar URL</label>
                <input type="url" [(ngModel)]="form()!.avatar" name="avatar" placeholder="https://...">
              </div>
              <div class="form-group">
                <label>Resume URL</label>
                <input type="url" [(ngModel)]="form()!.resumeUrl" name="resumeUrl" placeholder="https://...">
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="form-section">
            <div class="form-section-header">
              <h2 class="form-section-title">Social Links</h2>
              <button type="button" class="btn btn-sm btn-ghost" (click)="addSocial()">+ Add Link</button>
            </div>
            @for (social of form()!.socials; track $index; let i = $index) {
              <div class="social-row">
                <select [(ngModel)]="social.platform" [name]="'social-platform-' + i">
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="twitter">Twitter</option>
                  <option value="email">Email</option>
                  <option value="website">Website</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="youtube">YouTube</option>
                  <option value="medium">Medium</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="stackoverflow">Stack Overflow</option>
                  <option value="other">Other</option>
                </select>
                <input type="url" [(ngModel)]="social.url" [name]="'social-url-' + i" placeholder="URL">
                <input type="text" [(ngModel)]="social.label" [name]="'social-label-' + i" placeholder="Label (optional)">
                <button type="button" class="btn-icon btn-danger" (click)="removeSocial(i)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            }
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-accent">Save Profile</button>
            <button type="button" class="btn btn-ghost" (click)="resetForm()">Reset</button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .editor { max-width: 900px; }

    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem; }
    .text-secondary { color: var(--text-secondary); font-size: 0.875rem; }
    .loading { text-align: center; padding: 3rem; color: var(--text-tertiary); }

    .form-section {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1.25rem;
    }

    .form-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .form-section-header .form-section-title { margin: 0; }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width { grid-column: 1 / -1; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      font-family: inherit;
      transition: border-color 0.2s;
      outline: none;

      &:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-subtle);
      }
    }

    .form-group textarea { resize: vertical; }

    .social-row {
      display: grid;
      grid-template-columns: 160px 1fr 160px auto;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: center;
    }

    .social-row select,
    .social-row input {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.8125rem;
      outline: none;

      &:focus {
        border-color: var(--accent);
      }
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
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-danger {
      color: var(--text-tertiary);
      &:hover { color: var(--error); background: rgba(248, 113, 113, 0.1); }
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 0.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1.25rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
    .btn-accent { background: var(--accent); color: white; &:hover { opacity: 0.9; } }
    .btn-ghost {
      background: transparent; color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      &:hover { background: var(--bg-tertiary); }
    }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .social-row { grid-template-columns: 1fr; }
    }
  `],
})
export class AdminProfileEditorComponent implements OnInit {
  dataService = inject(AdminDataService);
  form = signal<Profile | null>(null);

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(): void {
    const p = this.dataService.profile();
    if (p) {
      this.form.set(JSON.parse(JSON.stringify(p)));
    }
  }

  addSocial(): void {
    const f = this.form();
    if (f) {
      f.socials.push({ platform: 'github', url: '', label: '' });
      this.form.set({ ...f });
    }
  }

  removeSocial(index: number): void {
    const f = this.form();
    if (f) {
      f.socials.splice(index, 1);
      this.form.set({ ...f });
    }
  }

  onSave(): void {
    const f = this.form();
    if (f) {
      this.dataService.updateProfile(f);
    }
  }
}
