import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { Education, Certification } from '../../../core/models';

@Component({
  selector: 'app-admin-education-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor">
      <div class="page-header">
        <h1>Education & Certifications</h1>
        <p class="text-secondary">Manage your academic qualifications and certifications</p>
      </div>

      <!-- Education Section -->
      <div class="section-card">
        <div class="section-header">
          <h2>Education</h2>
          <button class="btn btn-sm btn-ghost" (click)="addEducation()">+ Add</button>
        </div>

        @for (edu of educationList(); track $index; let i = $index) {
          <div class="entry-card">
            <div class="entry-grid">
              <div class="form-group">
                <label>Institution</label>
                <input type="text" [(ngModel)]="edu.institution" [name]="'edu-inst-'+i">
              </div>
              <div class="form-group">
                <label>Degree</label>
                <input type="text" [(ngModel)]="edu.degree" [name]="'edu-degree-'+i">
              </div>
              <div class="form-group">
                <label>Field of Study</label>
                <input type="text" [(ngModel)]="edu.field" [name]="'edu-field-'+i">
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="edu.location" [name]="'edu-loc-'+i">
              </div>
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" [(ngModel)]="edu.startDate" [name]="'edu-start-'+i">
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="edu.endDate" [name]="'edu-end-'+i">
              </div>
              <div class="form-group">
                <label>Grade/GPA</label>
                <input type="text" [(ngModel)]="edu.grade" [name]="'edu-grade-'+i">
              </div>
              <div class="form-group entry-actions-cell">
                <button class="btn btn-xs btn-danger-ghost" (click)="removeEducation(i)">Remove</button>
              </div>
            </div>
          </div>
        }
        @empty {
          <p class="empty-msg">No education entries yet.</p>
        }
      </div>

      <!-- Certifications Section -->
      <div class="section-card">
        <div class="section-header">
          <h2>Certifications</h2>
          <button class="btn btn-sm btn-ghost" (click)="addCertification()">+ Add</button>
        </div>

        @for (cert of certList(); track $index; let i = $index) {
          <div class="entry-card">
            <div class="entry-grid cols-3">
              <div class="form-group">
                <label>Certificate Name</label>
                <input type="text" [(ngModel)]="cert.name" [name]="'cert-name-'+i">
              </div>
              <div class="form-group">
                <label>Issuer</label>
                <input type="text" [(ngModel)]="cert.issuer" [name]="'cert-issuer-'+i">
              </div>
              <div class="form-group">
                <label>Date</label>
                <input type="date" [(ngModel)]="cert.date" [name]="'cert-date-'+i">
              </div>
              <div class="form-group">
                <label>Credential URL</label>
                <input type="url" [(ngModel)]="cert.url" [name]="'cert-url-'+i">
              </div>
              <div class="form-group">
                <label>Badge URL</label>
                <input type="url" [(ngModel)]="cert.badge" [name]="'cert-badge-'+i">
              </div>
              <div class="form-group entry-actions-cell">
                <button class="btn btn-xs btn-danger-ghost" (click)="removeCertification(i)">Remove</button>
              </div>
            </div>
          </div>
        }
        @empty {
          <p class="empty-msg">No certifications yet.</p>
        }
      </div>

      <div class="form-actions">
        <button class="btn btn-accent" (click)="onSave()">Save All Changes</button>
      </div>
    </div>
  `,
  styles: [`
    .editor { max-width: 1000px; }

    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem; }
    .text-secondary { color: var(--text-secondary); font-size: 0.875rem; }

    .section-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .section-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .entry-card {
      padding: 1rem;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      margin-bottom: 0.75rem;
      background: var(--bg-primary);
    }

    .entry-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 0.75rem;
      align-items: end;

      &.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    }

    .entry-actions-cell {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding-bottom: 0.25rem;
    }

    .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
    .form-group label { font-size: 0.75rem; font-weight: 500; color: var(--text-tertiary); }

    .form-group input {
      padding: 0.4375rem 0.625rem;
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 0.8125rem;
      font-family: inherit;
      outline: none;
      &:focus { border-color: var(--accent); }
    }

    .empty-msg {
      text-align: center;
      padding: 1rem;
      color: var(--text-tertiary);
      font-size: 0.8125rem;
    }

    .btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
    .btn-xs { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
    .btn-accent { background: var(--accent); color: white; &:hover { opacity: 0.9; } }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-subtle); &:hover { background: var(--bg-tertiary); } }
    .btn-danger-ghost { background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-subtle); &:hover { color: var(--error); border-color: var(--error); } }

    .form-actions { display: flex; gap: 0.75rem; }

    @media (max-width: 768px) {
      .entry-grid { grid-template-columns: 1fr 1fr; }
      .entry-grid.cols-3 { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 480px) {
      .entry-grid, .entry-grid.cols-3 { grid-template-columns: 1fr; }
    }
  `],
})
export class AdminEducationEditorComponent {
  dataService = inject(AdminDataService);

  educationList = signal<Education[]>([]);
  certList = signal<Certification[]>([]);

  constructor() {
    // Initialize with current data
    setTimeout(() => this.loadData(), 0);
  }

  private loadData(): void {
    this.educationList.set(JSON.parse(JSON.stringify(this.dataService.education())));
    this.certList.set(JSON.parse(JSON.stringify(this.dataService.certifications())));
  }

  addEducation(): void {
    this.educationList.update(list => [
      ...list,
      { institution: '', degree: '', field: '', startDate: '', endDate: '', location: '' },
    ]);
  }

  removeEducation(index: number): void {
    this.educationList.update(list => list.filter((_, i) => i !== index));
  }

  addCertification(): void {
    this.certList.update(list => [
      ...list,
      { name: '', issuer: '', date: '' },
    ]);
  }

  removeCertification(index: number): void {
    this.certList.update(list => list.filter((_, i) => i !== index));
  }

  onSave(): void {
    this.dataService.updateEducation(this.educationList());
    this.dataService.updateCertifications(this.certList());
  }
}
